#!/usr/bin/env bash
set -euo pipefail

root="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
fresh_config_dir="${FRESH_CONFIG_DIR:-$HOME/.config/fresh}"
plugins_dir="$fresh_config_dir/plugins"
types_dir="$fresh_config_dir/types"
stamp="$(date +%Y%m%d-%H%M%S)"

mkdir -p "$plugins_dir" "$types_dir"

backup_if_exists() {
  local path="$1"
  if [ -e "$path" ] || [ -L "$path" ]; then
    cp -a "$path" "$path.$stamp.bak"
  fi
}

backup_if_exists "$plugins_dir/fresh_pretty_vim.ts"
backup_if_exists "$plugins_dir/fresh_pretty_vim.i18n.json"
backup_if_exists "$types_dir/fresh.d.ts"
backup_if_exists "$fresh_config_dir/config.json"

cp "$root/plugins/fresh_pretty_vim.ts" "$plugins_dir/fresh_pretty_vim.ts"
cp "$root/plugins/fresh_pretty_vim.i18n.json" "$plugins_dir/fresh_pretty_vim.i18n.json"
cp "$root/types/fresh.d.ts" "$types_dir/fresh.d.ts"
cp "$root/config/config.json" "$fresh_config_dir/config.json"

echo "Installed fresh_pretty_vim into $fresh_config_dir"
echo "Restart Fresh to load the plugin."
