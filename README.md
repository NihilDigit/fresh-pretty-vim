# fresh-pretty-vim

A compact Fresh setup for single-file editing: Fresh built-in Vi mode, Markdown page view, hidden chrome, and a Nerd Font statusline.

## Architecture

`fresh_pretty_vim` is now a pure appearance/profile shell around Fresh's built-in `vi_mode` plugin.

- Fresh built-in `vi_mode` provides all Vim behavior: modes, keymaps, counts, operators, motions, registers, text objects, visual selections, repeat, and `:` command behavior.
- `fresh_pretty_vim` provides only the statusline appearance and profile defaults.
- This repository does not patch or duplicate Fresh's Vim implementation.

## What it changes

- Enables Fresh built-in `vi_mode` and configures it to auto-start.
- Keeps the compact left mode chip: ` NORMAL`, ` INSERT`, ` VISUAL`.
- Keeps one right status segment: language, scroll progress, cursor position, and Fresh's detected encoding.
- Hides the scroll progress bar at the top of the file.
- Disables Fresh's cursor-jump trail animation and keeps plugin motion short.
- Hides the menu bar, tab bar, and vertical scrollbar.
- Enables Markdown page view and line wrap.

## Files

```text
plugins/fresh_pretty_vim.ts            # appearance/statusline only
plugins/fresh_pretty_vim.i18n.json     # legacy translations retained for compatibility
types/fresh.d.ts                       # Fresh plugin API types for local checking
config/config.json                     # Fresh UI, built-in vi_mode, and plugin config
shell/fish/functions/fe.fish           # Optional fish wrapper, creates missing local files
install.sh                             # Copy files into ~/.config/fresh
setup.ps1                              # Copy files into $env:APPDATA\fresh on Windows
docs/fresh-vi-mode-gaps.md             # Fresh built-in vi_mode compatibility notes
docs/pr-description.md                 # PR description draft for this refactor
```

## Quick Setup

### Windows PowerShell

```powershell
git clone https://github.com/NihilDigit/fresh-pretty-vim.git
cd fresh-pretty-vim
powershell -NoProfile -ExecutionPolicy Bypass -File .\setup.ps1
```

The Windows setup script installs into `$env:APPDATA\fresh`, which is the config directory reported by `fresh --cmd config paths`. To install somewhere else, set `FRESH_CONFIG_DIR` before running it.

### macOS / Linux

```bash
git clone https://github.com/NihilDigit/fresh-pretty-vim.git
cd fresh-pretty-vim
./install.sh
```

Both installers back up existing target files with a timestamped `.bak` suffix, then copy the plugin and config into the Fresh config directory.

Restart Fresh after installing.

## Configuration

The installed `config/config.json` keeps `fresh_pretty_vim` enabled for the statusline and profile defaults, and enables Fresh built-in `vi_mode` with auto-start:

```json
"plugins": {
  "vi_mode": {
    "enabled": true,
    "settings": {
      "autoStart": true
    }
  },
  "fresh_pretty_vim": {
    "enabled": true
  }
}
```

Do not add Vim keymaps to `fresh_pretty_vim`; configure or improve Vim behavior in Fresh's built-in `vi_mode` upstream.

## Optional fish wrapper

```bash
cp shell/fish/functions/fe.fish ~/.config/fish/functions/fe.fish
```

`fe missing.md` creates `missing.md` first, then opens it with Fresh. Fresh location syntax also works, for example `fe notes.md:12`.

The wrapper only skips obvious non-file arguments such as flags, `-`, URLs, and scp-style remote paths. If you pass a plain positional argument that is not meant to be a file, it may still create a local file. Set `FE_CREATE_MISSING=0` to disable automatic creation for one shell session.

## Requirements

- Fresh with the built-in `vi_mode` plugin and its `autoStart` setting.
- A Nerd Font in the terminal.
- `marksman`, if you want Markdown LSP support.
