# Portfolio — Production Deployment Runbook

**Target:** `https://mcdtronix.co.zw` on the Contabo VPS `173.249.26.101` (Ubuntu 24.04)
**Stack:** React/Vite SPA (static, served by Nginx) · Django REST API on Gunicorn · PostgreSQL 16
**Delivery:** GitHub Actions → SSH (restricted `deploy` user) → atomic release with backup, pre-flight test and automatic rollback

---

## 1. Architecture

```
            GitHub push (main)
                   │
   ┌───────────────▼────────────────┐
   │ GitHub Actions                 │
   │  backend  : migrations check,  │
   │             deploy checks,     │
   │             tests on Postgres  │
   │  frontend : lint + build       │
   │  scripts  : shellcheck         │
   │  package  : release.tar.gz     │
   │  deploy   : scp + deploy.sh    │
   │  verify   : public HTTPS check │──┐ fails → rollback.sh
   └───────────────┬────────────────┘  │
                   │ SSH (key, pinned host key)
   ┌───────────────▼─────────────────────────────────────────┐
   │ VPS                                                      │
   │  Nginx :443 ── /            → current/frontend (static)  │
   │            ├── /api, /admin → Gunicorn 127.0.0.1:8001    │
   │            ├── /static      → current/backend/staticfiles│
   │            └── /media       → shared/media               │
   │  PostgreSQL (localhost only) · nightly backup timer      │
   └──────────────────────────────────────────────────────────┘
```

### Server layout

```
/srv/apps/portfolio/
├── current -> releases/20261028143000-ab12cd3   # atomic symlink, what is live
├── releases/<timestamp>-<sha>/                  # last 5 kept for instant rollback
│   ├── REVISION
│   ├── frontend/                                # Vite dist
│   └── backend/  (.env -> shared, media -> shared, .venv -> venvs/<hash>)
├── shared/
│   ├── .env                                     # production secrets (600, never in git)
│   └── media/                                   # uploads, survive every release
├── venvs/<requirements-hash>/                   # reused while requirements.txt is unchanged
├── bin/                                         # deploy.sh, rollback.sh, backup.sh, lib.sh, app.conf
├── incoming/                                    # uploaded release archives
└── logs/                                        # deploy-*.log, releases.log

/var/backups/apps/portfolio/{db,media}/          # pg_dump (custom format) + media tarballs, 14 days
```

### Repository layout

| Path | Purpose |
|---|---|
| `.github/workflows/deploy.yml` | CI on every PR, CI + CD on every push to `main` |
| `deploy/app.conf` | The only per-app settings (domain, port, paths, smoke-test endpoints) |
| `deploy/scripts/deploy.sh` | Server-side release pipeline with automatic rollback |
| `deploy/scripts/rollback.sh` | Manual rollback (code, and optionally database) |
| `deploy/scripts/backup.sh` | Nightly DB + media backup |
| `deploy/server/bootstrap-portfolio.sh` | One-time, idempotent server provisioning |
| `deploy/nginx/`, `deploy/systemd/` | Nginx site + snippets, Gunicorn service, backup timer |

---

## 2. What happens on every deploy

| # | Step | On failure |
|---|---|---|
| 1 | Unpack release into `releases/<id>` | Abort — live site untouched |
| 2 | Build/reuse virtualenv, `check --deploy`, `collectstatic` | Abort — live site untouched |
| 3 | **Back up the database** (`pg_dump`, verified with `pg_restore --list`) | Abort — live site untouched |
| 4 | Apply migrations (only if pending) | **Restore DB**, keep old release |
| 5 | **Pre-flight**: boot new release on `127.0.0.1:8091`, hit `/api/health/` + every API endpoint | **Restore DB** if migrated, keep old release |
| 6 | Atomically switch `current`, restart Gunicorn, wait for health | **Restore DB**, switch back, restart |
| 7 | Verify via Nginx + TLS: health, API, homepage, JS bundle | **Restore DB**, switch back, restart |
| 8 | Prune old releases/venvs/backups | — |
| 9 | GitHub runner checks `https://mcdtronix.co.zw` from the internet | `rollback.sh` (code) |

A failed release is kept as `releases/<id>.failed` for 7 days, and every run is logged in `logs/deploy-*.log`.

> **Note on database rollback:** the automatic restore only happens when that deploy applied migrations, and it
> covers the few seconds between backup and failure. Keep migrations backward-compatible
> (add columns first, remove them in a later release) and rollbacks stay code-only.

---

## 3. First-time setup (once)

### 3.1 DNS

At your `.co.zw` registrar / DNS host, point the domain at the new VPS (and away from the old server):

| Type | Name | Value | TTL |
|---|---|---|---|
| A | `@` | `173.249.26.101` | 300 |
| A | `www` | `173.249.26.101` | 300 |
| A | `pms` | `173.249.26.101` | 300 *(for later)* |

Add `AAAA → 2a02:c207:2370:2976::1` only after confirming IPv6 works (`curl -6 https://example.com` on the VPS).

Check from Windows PowerShell — both must return `173.249.26.101`:

```powershell
Resolve-DnsName mcdtronix.co.zw -Type A
Resolve-DnsName www.mcdtronix.co.zw -Type A
```

### 3.2 Create the GitHub Actions deploy key (Windows PowerShell)

A dedicated key, no passphrase (CI must use it unattended), used for nothing else:

```powershell
ssh-keygen -t ed25519 -C "github-actions@portfolio" -f "$env:USERPROFILE\.ssh\portfolio_deploy" -N '""'
```

### 3.3 Upload the deploy kit and provision the server

From the project root on Windows:

```powershell
scp -r deploy "$env:USERPROFILE\.ssh\portfolio_deploy.pub" root@173.249.26.101:/root/
```

On the VPS, as root:

```bash
cd /root/deploy
CERTBOT_EMAIL=you@example.com bash server/bootstrap-portfolio.sh /root/portfolio_deploy.pub
```

The script verifies DNS, creates the `deploy` user and the directory layout, creates the `portfolio_db` database
and `portfolio_main` role with a generated password, writes `/srv/apps/portfolio/shared/.env` with a generated
`SECRET_KEY`, installs the systemd units and a sudoers rule limited to `systemctl restart portfolio`, obtains the
Let's Encrypt certificate and enables the Nginx site. It ends by printing the values for the GitHub secrets.

It is safe to re-run; existing secrets, data and certificates are kept.

### 3.4 GitHub secrets

Repository → **Settings → Secrets and variables → Actions**. These replace the secrets from the old server:

| Secret | Value |
|---|---|
| `VPS_HOST` | `173.249.26.101` |
| `VPS_USER` | `deploy` |
| `VPS_SSH_KEY` | full contents of `%USERPROFILE%\.ssh\portfolio_deploy` (the **private** key) |
| `VPS_KNOWN_HOSTS` | the `173.249.26.101 ssh-ed25519 AAAA…` line printed by the bootstrap script |
| `VPS_PORT` | only if SSH is not on port 22 |

With the GitHub CLI:

```powershell
gh secret set VPS_HOST --body "173.249.26.101"
gh secret set VPS_USER --body "deploy"
Get-Content "$env:USERPROFILE\.ssh\portfolio_deploy" -Raw | gh secret set VPS_SSH_KEY
gh secret set VPS_KNOWN_HOSTS --body "<line printed by bootstrap>"
```

Optional: **Settings → Environments → production** → add yourself as a required reviewer to approve each
production deploy manually.

### 3.5 First deploy

Push to `main` or run **Actions → CI/CD · Portfolio → Run workflow**. The first run creates an empty
database schema; there is no previous release to roll back to on this run only.

### 3.6 Load the portfolio content and create an admin

Export content from your local database (Windows, in `Backend/`, with the local virtualenv active):

```powershell
python manage.py dumpdata api --indent 2 -o portfolio-data.json
scp portfolio-data.json root@173.249.26.101:/tmp/
scp -r media\* root@173.249.26.101:/srv/apps/portfolio/shared/media/
```

On the VPS:

```bash
chown -R deploy:deploy /srv/apps/portfolio/shared/media /tmp/portfolio-data.json
sudo -u deploy bash -c 'cd /srv/apps/portfolio/current/backend && .venv/bin/python manage.py loaddata /tmp/portfolio-data.json'
sudo -u deploy bash -c 'cd /srv/apps/portfolio/current/backend && .venv/bin/python manage.py createsuperuser'
rm /tmp/portfolio-data.json
```

Admin: `https://mcdtronix.co.zw/admin/`

---

## 4. Day-to-day operations

All commands run on the VPS.

```bash
# What is live, and what can I roll back to?
sudo -u deploy /srv/apps/portfolio/bin/rollback.sh --list

# Roll back code to the previous release (instant)
sudo -u deploy /srv/apps/portfolio/bin/rollback.sh

# Roll back to a specific release AND restore the database (takes a safety backup first)
sudo -u deploy /srv/apps/portfolio/bin/rollback.sh --to 20261028143000-ab12cd3 \
     --restore-db /var/backups/apps/portfolio/db/portfolio-20261028-143000-pre-20261028143000-ab12cd3.dump

# Service health and logs
systemctl status portfolio
journalctl -u portfolio -f
tail -f /var/log/nginx/portfolio.error.log
ls -t /srv/apps/portfolio/logs/ | head          # deploy logs
curl -s https://mcdtronix.co.zw/api/health/

# Backups
systemctl list-timers portfolio-backup.timer
sudo systemctl start portfolio-backup.service    # back up now
ls -lh /var/backups/apps/portfolio/db/

# Certificates (auto-renewed by certbot.timer)
certbot certificates
```

Production configuration lives in `/srv/apps/portfolio/shared/.env`. After editing it, run
`systemctl restart portfolio`.

---

## 5. Adding the Prison Management System (`pms.mcdtronix.co.zw`)

The scripts are app-agnostic. In the PMS repository:

1. Copy `deploy/` and `.github/workflows/deploy.yml`.
2. Edit `deploy/app.conf`: `APP_NAME=pms`, `SERVICE=pms`, `DOMAIN=pms.mcdtronix.co.zw`,
   `APP_ROOT=/srv/apps/pms`, `BACKUP_ROOT=/var/backups/apps/pms`, `APP_PORT=8002`, `PREFLIGHT_PORT=8092`,
   and its own `SMOKE_PATHS`.
3. Rename/adjust the Nginx site, systemd unit and sudoers file (paths, port `8002`, service `pms`),
   and in the bootstrap script use `pms_db` / `pms_app` with a single `-d pms.mcdtronix.co.zw` certificate.
4. Use a **separate deploy key** for that repository.

Each app gets its own database role, secrets, service, release history and backups — deploying one can never
break the other.

---

## 6. Recommended next hardening

- **Off-server backups.** Backups on the same VPS do not survive losing the VPS. Sync
  `/var/backups/apps` nightly to object storage (e.g. Contabo Object Storage or Backblaze B2 with `rclone`),
  encrypted.
- **SSH.** Once key login for your admin account is proven in a second session, set
  `PermitRootLogin no` and `PasswordAuthentication no` in `/etc/ssh/sshd_config.d/99-hardening.conf`.
- **Restore drill.** Monthly, restore the latest dump into a scratch database to prove backups work.
- **Uptime monitoring.** Point a free monitor (UptimeRobot, Better Stack) at `https://mcdtronix.co.zw/api/health/`.
