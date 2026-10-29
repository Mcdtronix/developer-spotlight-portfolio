#!/usr/bin/env bash
# Nightly database + media backup. Triggered by portfolio-backup.timer (runs as `deploy`).
set -Eeuo pipefail

# shellcheck source=lib.sh
source "$(dirname "${BASH_SOURCE[0]}")/lib.sh"

db="$(backup_database nightly)"
ok "Database: $db ($(du -h "$db" | cut -f1))"

media="$(backup_media)"
ok "Media:    $media ($(du -h "$media" | cut -f1))"

prune_backups
ok "Backups older than ${BACKUP_RETENTION_DAYS} days pruned"
