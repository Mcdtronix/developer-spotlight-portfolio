#!/usr/bin/env bash
# -----------------------------------------------------------------------------
# One-time (idempotent) server provisioning for the portfolio on mcdtronix.co.zw.
# Run as root on the VPS from the uploaded deploy/ folder:
#
#   sudo CERTBOT_EMAIL=you@example.com bash server/bootstrap-portfolio.sh /root/github_deploy.pub
#
# Safe to re-run: existing secrets, database, certificate and keys are kept.
#
#   1. Preconditions (root, DNS points here)
#   2. deploy user, groups and SSH key for GitHub Actions
#   3. Directory layout under /srv/apps/portfolio
#   4. PostgreSQL role + database, production .env with generated secrets
#   5. systemd service + nightly backup timer, scoped sudoers rule
#   6. Nginx + Let's Encrypt certificate (webroot), final HTTPS site
# -----------------------------------------------------------------------------
set -Eeuo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"     # the deploy/ folder
# shellcheck source=../app.conf
source "$HERE/app.conf"

DEPLOY_USER="deploy"
DB_NAME="portfolio_db"
DB_USER="portfolio_main"
DEPLOY_PUBKEY_FILE="${1:-}"
CERT_DIR="/etc/letsencrypt/live/${DOMAIN}"
ACME_ROOT="/var/www/letsencrypt"

log()  { printf '\033[1;34m==>\033[0m %s\n' "$*"; }
ok()   { printf '\033[1;32m  ✔\033[0m %s\n' "$*"; }
warn() { printf '\033[1;33m  ⚠\033[0m %s\n' "$*"; }
die()  { printf '\033[1;31m  ✖ %s\033[0m\n' "$*"; exit 1; }

# ------------------------------------------------------------ 1. checks -------
log "Preconditions"
[[ $EUID -eq 0 ]] || die "Run as root."
[[ -n "${CERTBOT_EMAIL:-}" ]] || die "Set CERTBOT_EMAIL (Let's Encrypt expiry notices)."

cd /   # keeps `sudo -u postgres` from warning about /root
SERVER_IP="$(ip -4 route get 1.1.1.1 | awk '{for (i = 1; i <= NF; i++) if ($i == "src") print $(i + 1)}')"
for host in "$DOMAIN" "www.$DOMAIN"; do
  resolved="$(getent ahostsv4 "$host" | awk 'NR==1{print $1}')"
  if [[ "$resolved" == "$SERVER_IP" ]]; then ok "$host -> $SERVER_IP"
  else die "$host resolves to '${resolved:-nothing}', expected $SERVER_IP. Fix DNS A records first."; fi
done

apt-get update -qq
DEBIAN_FRONTEND=noninteractive apt-get install -y -qq \
  nginx postgresql postgresql-contrib python3-venv certbot curl rsync >/dev/null
ok "Packages present"

# ---------------------------------------------------- 2. deploy user ----------
log "Deploy user"
if ! id "$DEPLOY_USER" &>/dev/null; then
  adduser --disabled-password --gecos "" "$DEPLOY_USER"
fi
usermod -aG "$DEPLOY_USER" www-data            # Nginx can read releases + media
install -d -m 700 -o "$DEPLOY_USER" -g "$DEPLOY_USER" "/home/$DEPLOY_USER/.ssh"
AUTH_KEYS="/home/$DEPLOY_USER/.ssh/authorized_keys"
touch "$AUTH_KEYS"
if [[ -n "$DEPLOY_PUBKEY_FILE" ]]; then
  [[ -f "$DEPLOY_PUBKEY_FILE" ]] || die "Public key not found: $DEPLOY_PUBKEY_FILE"
  key="$(head -n1 "$DEPLOY_PUBKEY_FILE")"
  [[ "$key" == ssh-ed25519\ * ]] || die "Expected an ssh-ed25519 PUBLIC key."
  if ! grep -qF "$key" "$AUTH_KEYS"; then
    # `restrict` = no PTY, no port/agent/X11 forwarding. Commands and scp still work.
    echo "restrict $key" >> "$AUTH_KEYS"
    ok "GitHub Actions key installed (restricted)"
  else
    ok "GitHub Actions key already installed"
  fi
fi
chown "$DEPLOY_USER:$DEPLOY_USER" "$AUTH_KEYS"; chmod 600 "$AUTH_KEYS"

# ------------------------------------------------------- 3. directories -------
log "Directory layout"
install -d -m 750 -o "$DEPLOY_USER" -g "$DEPLOY_USER" /srv/apps
for d in "" releases shared shared/media venvs incoming bin logs; do
  install -d -m 750 -o "$DEPLOY_USER" -g "$DEPLOY_USER" "$APP_ROOT/$d"
done
install -d -m 711 -o root -g root /var/backups/apps                # traverse only
install -d -m 700 -o "$DEPLOY_USER" -g "$DEPLOY_USER" "$BACKUP_ROOT"
install -d -m 755 "$ACME_ROOT"

# Deploy scripts (CI refreshes them on every deploy).
install -m 750 -o "$DEPLOY_USER" -g "$DEPLOY_USER" "$HERE"/scripts/*.sh "$APP_ROOT/bin/"
install -m 640 -o "$DEPLOY_USER" -g "$DEPLOY_USER" "$HERE/app.conf" "$APP_ROOT/bin/app.conf"
ok "$APP_ROOT ready"

# ------------------------------------------------ 4. database + secrets -------
log "PostgreSQL and production secrets"
ENV_FILE="$APP_ROOT/shared/.env"
role_exists="$(sudo -u postgres psql -tAc "SELECT 1 FROM pg_roles WHERE rolname='${DB_USER}'")"

if [[ -f "$ENV_FILE" && "$role_exists" == "1" ]]; then
  ok "Existing $ENV_FILE and database role kept"
else
  db_password="$(openssl rand -hex 24)"
  secret_key="$(openssl rand -base64 64 | tr -dc 'A-Za-z0-9' | head -c 64)"

  # Password goes through stdin, never argv / shell history.
  sudo -u postgres psql -v ON_ERROR_STOP=1 -q <<SQL
\\set pw '${db_password}'
SELECT format('CREATE ROLE %I LOGIN', '${DB_USER}')
 WHERE NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = '${DB_USER}') \\gexec
ALTER ROLE ${DB_USER} WITH LOGIN PASSWORD :'pw';
SELECT format('CREATE DATABASE %I OWNER %I', '${DB_NAME}', '${DB_USER}')
 WHERE NOT EXISTS (SELECT 1 FROM pg_database WHERE datname = '${DB_NAME}') \\gexec
REVOKE ALL ON DATABASE ${DB_NAME} FROM PUBLIC;
SQL

  umask 077
  cat > "$ENV_FILE" <<ENV
# Production settings for ${DOMAIN}. Generated $(date -Is). Never commit.
SECRET_KEY=${secret_key}
DEBUG=False
ALLOWED_HOSTS=${DOMAIN},www.${DOMAIN},127.0.0.1,localhost
CSRF_TRUSTED_ORIGINS=https://${DOMAIN},https://www.${DOMAIN}
CORS_ALLOW_ALL_ORIGINS=False

DB_ENGINE=postgresql
DB_NAME=${DB_NAME}
DB_USER=${DB_USER}
DB_PASSWORD=${db_password}
DB_HOST=127.0.0.1
DB_PORT=5432

LOG_LEVEL=INFO
ENV
  umask 022
  ok "Database ${DB_NAME} / role ${DB_USER} ready, secrets written to $ENV_FILE"
fi
chown "$DEPLOY_USER:$DEPLOY_USER" "$ENV_FILE"; chmod 600 "$ENV_FILE"

# ------------------------------------------------ 5. systemd + sudoers --------
log "systemd units and sudoers"
install -m 644 "$HERE"/systemd/portfolio.service        /etc/systemd/system/
install -m 644 "$HERE"/systemd/portfolio-backup.service /etc/systemd/system/
install -m 644 "$HERE"/systemd/portfolio-backup.timer   /etc/systemd/system/
systemctl daemon-reload
systemctl enable portfolio.service >/dev/null          # started by the first deploy
systemctl enable --now portfolio-backup.timer >/dev/null

visudo -cf "$HERE/server/sudoers-deploy-portfolio" >/dev/null || die "sudoers file invalid"
install -m 440 -o root -g root "$HERE/server/sudoers-deploy-portfolio" /etc/sudoers.d/deploy-portfolio
ok "portfolio.service enabled, nightly backup timer active, sudo scoped to 'systemctl restart portfolio'"

# --------------------------------------------------- 6. nginx + TLS -----------
log "Nginx and TLS"
install -m 644 "$HERE"/nginx/snippets/*.conf /etc/nginx/snippets/
rm -f /etc/nginx/sites-enabled/default

if [[ ! -f "$CERT_DIR/fullchain.pem" ]]; then
  # Temporary HTTP-only site so Let's Encrypt can validate the domain.
  cat > /etc/nginx/sites-available/acme-bootstrap.conf <<NGINX
server {
    listen 80;
    listen [::]:80;
    server_name ${DOMAIN} www.${DOMAIN};
    location ^~ /.well-known/acme-challenge/ { root ${ACME_ROOT}; default_type text/plain; }
    location / { return 404; }
}
NGINX
  ln -sfn /etc/nginx/sites-available/acme-bootstrap.conf /etc/nginx/sites-enabled/acme-bootstrap.conf
  nginx -t && systemctl reload nginx

  certbot certonly --webroot -w "$ACME_ROOT" \
    -d "$DOMAIN" -d "www.$DOMAIN" \
    --email "$CERTBOT_EMAIL" --agree-tos --no-eff-email --non-interactive \
    --deploy-hook "systemctl reload nginx"

  rm -f /etc/nginx/sites-enabled/acme-bootstrap.conf /etc/nginx/sites-available/acme-bootstrap.conf
  ok "Certificate issued for $DOMAIN and www.$DOMAIN"
else
  ok "Certificate already present"
fi

install -m 644 "$HERE/nginx/${DOMAIN}.conf" "/etc/nginx/sites-available/${DOMAIN}.conf"
ln -sfn "/etc/nginx/sites-available/${DOMAIN}.conf" "/etc/nginx/sites-enabled/${DOMAIN}.conf"
nginx -t
systemctl restart nginx    # restart (not reload) so workers pick up www-data's new group
certbot renew --dry-run --quiet && ok "Certificate auto-renewal works"

# ---------------------------------------------------------------- done --------
cat <<DONE

$(printf '\033[1;32m')Server is ready for the first deployment.$(printf '\033[0m')

Add these GitHub repository secrets (Settings -> Secrets and variables -> Actions):

  VPS_HOST         ${SERVER_IP}
  VPS_USER         ${DEPLOY_USER}
  VPS_SSH_KEY      contents of the PRIVATE key matching ${DEPLOY_PUBKEY_FILE:-<your deploy key>.pub}
  VPS_KNOWN_HOSTS  the line below:

$(ssh-keyscan -t ed25519 localhost 2>/dev/null | sed "s/^localhost/${SERVER_IP}/")

Host key fingerprint (compare when you first SSH in):
  $(ssh-keygen -lf /etc/ssh/ssh_host_ed25519_key.pub)

Then push to main — or run the workflow manually — to deploy.
DONE
