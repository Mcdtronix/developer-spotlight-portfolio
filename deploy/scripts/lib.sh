#!/usr/bin/env bash
# Shared helpers for deploy.sh, rollback.sh and backup.sh. Sourced, never executed.
# shellcheck disable=SC2034  # variables are consumed by the scripts that source this file

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# app.conf sits next to the scripts on the server, one level up in the repo.
if [[ -f "$SCRIPT_DIR/app.conf" ]]; then
  # shellcheck source=../app.conf
  source "$SCRIPT_DIR/app.conf"
else
  # shellcheck source=../app.conf
  source "$SCRIPT_DIR/../app.conf"
fi

RELEASES_DIR="$APP_ROOT/releases"
SHARED_DIR="$APP_ROOT/shared"
VENVS_DIR="$APP_ROOT/venvs"
CURRENT_LINK="$APP_ROOT/current"
ENV_FILE="$SHARED_DIR/.env"

# ---------------------------------------------------------------- logging ----

log()  { printf '\033[1;34m[%s]\033[0m %s\n' "$(date +%H:%M:%S)" "$*" >&2; }
ok()   { printf '\033[1;32m[%s] ✔ %s\033[0m\n' "$(date +%H:%M:%S)" "$*" >&2; }
warn() { printf '\033[1;33m[%s] ⚠ %s\033[0m\n' "$(date +%H:%M:%S)" "$*" >&2; }
err()  { printf '\033[1;31m[%s] ✖ %s\033[0m\n' "$(date +%H:%M:%S)" "$*" >&2; }
step() { printf '\n\033[1;36m==> %s\033[0m\n' "$*" >&2; }
die()  { err "$*"; exit 1; }

# ------------------------------------------------------------ environment ----

# Read one KEY from shared/.env without sourcing it (values may hold shell metacharacters).
env_get() {
  local value
  value="$(sed -n "s/^${1}=//p" "$ENV_FILE" | tail -n1)"
  value="${value%\"}"; value="${value#\"}"
  printf '%s' "$value"
}

load_db_env() {
  [[ -r "$ENV_FILE" ]] || die "Missing $ENV_FILE — run bootstrap-portfolio.sh first."
  DB_NAME="$(env_get DB_NAME)"
  DB_USER="$(env_get DB_USER)"
  DB_HOST="$(env_get DB_HOST)"; DB_HOST="${DB_HOST:-127.0.0.1}"
  DB_PORT="$(env_get DB_PORT)"; DB_PORT="${DB_PORT:-5432}"
  PGPASSWORD="$(env_get DB_PASSWORD)"
  export PGPASSWORD
}

# Run manage.py inside a given release.
manage() {
  local release="$1"; shift
  (cd "$release/backend" && .venv/bin/python manage.py "$@")
}

# ---------------------------------------------------------------- backups ----

# Dump the database in custom format and verify the dump is readable.
# Prints the dump path on stdout.
backup_database() {
  local label="$1" dir file
  load_db_env
  dir="$BACKUP_ROOT/db"
  mkdir -p "$dir" && chmod 700 "$dir"
  file="$dir/${APP_NAME}-$(date +%Y%m%d-%H%M%S)-${label}.dump"

  pg_dump --host "$DB_HOST" --port "$DB_PORT" --username "$DB_USER" --dbname "$DB_NAME" \
          --format custom --no-owner --file "$file.partial" \
    || { rm -f "$file.partial"; return 1; }
  pg_restore --list "$file.partial" >/dev/null || { rm -f "$file.partial"; return 1; }
  mv "$file.partial" "$file"
  chmod 600 "$file"
  printf '%s' "$file"
}

backup_media() {
  local dir file
  dir="$BACKUP_ROOT/media"
  mkdir -p "$dir" && chmod 700 "$dir"
  file="$dir/${APP_NAME}-media-$(date +%Y%m%d-%H%M%S).tar.gz"
  tar -czf "$file" -C "$SHARED_DIR" media
  chmod 600 "$file"
  printf '%s' "$file"
}

restore_database() {
  local file="$1"
  [[ -f "$file" ]] || die "Backup not found: $file"
  load_db_env
  pg_restore --host "$DB_HOST" --port "$DB_PORT" --username "$DB_USER" --dbname "$DB_NAME" \
             --clean --if-exists --no-owner --single-transaction "$file"
}

prune_backups() {
  find "$BACKUP_ROOT" -type f \( -name '*.dump' -o -name '*.tar.gz' \) \
       -mtime +"$BACKUP_RETENTION_DAYS" -print -delete >&2 || true
}

# ----------------------------------------------------------- health checks ---

# http_ok URL [extra curl args...] — succeeds on HTTP 200.
http_ok() {
  local url="$1"; shift
  local code
  code="$(curl -sS -o /dev/null -w '%{http_code}' --max-time 10 "$@" "$url" 2>/dev/null)" || return 1
  [[ "$code" == "200" ]]
}

# health_ok BASE_URL [extra curl args...] — health endpoint reports app + database OK.
health_ok() {
  local base="$1"; shift
  curl -fsS --max-time 10 "$@" "${base}${HEALTH_PATH}" 2>/dev/null | grep -q '"status": "ok"'
}

# wait_healthy TRIES BASE_URL [curl args...]
wait_healthy() {
  local tries="$1"; shift
  local i
  for ((i = 1; i <= tries; i++)); do
    health_ok "$@" && return 0
    sleep 2
  done
  return 1
}

# smoke_test BASE_URL [curl args...] — every API endpoint the frontend uses answers 200.
smoke_test() {
  local base="$1"; shift
  local path
  for path in $SMOKE_PATHS; do
    http_ok "${base}${path}" "$@" || { err "Smoke test failed: ${path}"; return 1; }
  done
}

# verify_live — full check through Nginx + TLS on this host (no DNS dependency).
verify_live() {
  local resolve=(--resolve "${DOMAIN}:443:127.0.0.1")
  local base="https://${DOMAIN}"
  local html asset

  wait_healthy 15 "$base" "${resolve[@]}"   || { err "Health check failed via Nginx"; return 1; }
  smoke_test "$base" "${resolve[@]}"        || return 1

  html="$(curl -fsS --max-time 10 "${resolve[@]}" "$base/")" || { err "Homepage unreachable"; return 1; }
  grep -q 'id="root"' <<<"$html"            || { err "Homepage is not the React app"; return 1; }
  asset="$(grep -o '/assets/[^"]*\.js' <<<"$html" | head -n1)"
  [[ -n "$asset" ]] && { http_ok "${base}${asset}" "${resolve[@]}" || { err "Bundle missing: $asset"; return 1; }; }
  return 0
}

# ---------------------------------------------------------------- releases ---

# Atomically point `current` at a release.
switch_current() {
  ln -sfn "$1" "$CURRENT_LINK.tmp"
  mv -Tf "$CURRENT_LINK.tmp" "$CURRENT_LINK"
}

restart_service() {
  sudo -n /usr/bin/systemctl restart "$SERVICE"
}

# Releases sorted oldest -> newest (names start with a timestamp).
list_releases() {
  find "$RELEASES_DIR" -mindepth 1 -maxdepth 1 -type d ! -name '*.failed' -printf '%f\n' | sort
}
