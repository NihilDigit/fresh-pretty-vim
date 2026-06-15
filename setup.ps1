param(
    [string]$FreshConfigDir = $env:FRESH_CONFIG_DIR
)

$ErrorActionPreference = "Stop"

$Root = Split-Path -Parent $MyInvocation.MyCommand.Path

if (-not $FreshConfigDir) {
    if ($env:APPDATA) {
        $FreshConfigDir = Join-Path $env:APPDATA "fresh"
    }
    elseif ($env:HOME) {
        $FreshConfigDir = Join-Path $env:HOME ".config/fresh"
    }
    else {
        throw "Set FRESH_CONFIG_DIR or APPDATA before running setup.ps1."
    }
}

$PluginsDir = Join-Path $FreshConfigDir "plugins"
$TypesDir = Join-Path $FreshConfigDir "types"
$Stamp = Get-Date -Format "yyyyMMdd-HHmmss"

New-Item -ItemType Directory -Force -Path $PluginsDir, $TypesDir | Out-Null

function Backup-IfExists {
    param([string]$Path)

    if (Test-Path -LiteralPath $Path) {
        Copy-Item -LiteralPath $Path -Destination "$Path.$Stamp.bak" -Recurse -Force
    }
}

Backup-IfExists (Join-Path $PluginsDir "fresh_pretty_vim.ts")
Backup-IfExists (Join-Path $PluginsDir "fresh_pretty_vim.i18n.json")
Backup-IfExists (Join-Path $TypesDir "fresh.d.ts")
Backup-IfExists (Join-Path $FreshConfigDir "config.json")

Copy-Item -LiteralPath (Join-Path $Root "plugins/fresh_pretty_vim.ts") -Destination (Join-Path $PluginsDir "fresh_pretty_vim.ts") -Force
Copy-Item -LiteralPath (Join-Path $Root "plugins/fresh_pretty_vim.i18n.json") -Destination (Join-Path $PluginsDir "fresh_pretty_vim.i18n.json") -Force
Copy-Item -LiteralPath (Join-Path $Root "types/fresh.d.ts") -Destination (Join-Path $TypesDir "fresh.d.ts") -Force
Copy-Item -LiteralPath (Join-Path $Root "config/config.json") -Destination (Join-Path $FreshConfigDir "config.json") -Force

Write-Host "Installed fresh_pretty_vim into $FreshConfigDir"
Write-Host "Restart Fresh to load the plugin."
