# fresh-pretty-vim

A compact Fresh setup for single-file editing: Vi mode, Markdown page view, hidden chrome, and a Nerd Font statusline.

## What it changes

- Starts Fresh in Vi mode.
- Adds arrow-key navigation to normal, operator-pending, visual, visual-line, and visual-block modes.
- Shows a compact left mode chip: ` NORMAL`, ` INSERT`, ` VISUAL`.
- Shows one right status segment: language, scroll progress, cursor position, and detected encoding.
- Hides the scroll progress bar at the top of the file.
- Opens `:` as a centered Vi command menu with common commands and filtering.
- Shows Vi command errors such as `:q` on modified buffers in a centered popup.
- Disables Fresh's cursor-jump trail animation and keeps plugin motion short.
- Hides the menu bar, tab bar, and vertical scrollbar.
- Enables Markdown page view and line wrap.

## Files

```text
plugins/fresh_pretty_vim.ts            # Vi mode + statusline
plugins/fresh_pretty_vim.i18n.json     # Vi command translations
config/config.json                     # Fresh UI and plugin config
shell/fish/functions/fe.fish           # Optional fish wrapper, creates missing local files
install.sh                             # Copy files into ~/.config/fresh
```

## Install

```bash
./install.sh
```

The installer backs up existing target files with a timestamped `.bak` suffix, then copies the plugin and config into `~/.config/fresh`.

Restart Fresh after installing.

## Optional fish wrapper

```bash
cp shell/fish/functions/fe.fish ~/.config/fish/functions/fe.fish
```

`fe missing.md` creates `missing.md` first, then opens it with Fresh. Fresh location syntax also works, for example `fe notes.md:12`.

## Requirements

- Fresh 0.4.x
- A Nerd Font in the terminal
- `file` from the system toolchain, used to detect file encoding for the statusline
- `marksman`, if you want Markdown LSP support
