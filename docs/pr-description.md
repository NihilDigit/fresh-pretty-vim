# Summary

Refactor `fresh_pretty_vim` into a pure appearance/profile shell around Fresh's built-in `vi_mode`.

# What changed

- Replaced the custom Vim implementation in `plugins/fresh_pretty_vim.ts` with statusline-only logic.
- Kept the existing mode chip labels, language/progress/position/encoding statusline, statusline token names, and profile-related config.
- Updated the installed config to enable Fresh built-in `vi_mode` with `autoStart: true` while keeping `fresh_pretty_vim` enabled for appearance.
- Updated documentation to explain that Fresh built-in `vi_mode` provides Vim behavior and `fresh_pretty_vim` provides appearance/profile behavior only.

# What was intentionally removed

- Local Vi state and mode type definitions.
- Pending operator/count/find/text-object state.
- Operator + motion handling.
- Visual, visual-line, and visual-block behavior.
- Text object behavior.
- Dot-repeat tracking.
- Custom `:` command parsing/menu behavior.
- All `editor.defineMode("vi-...`) registrations.
- Vim behavior handlers and `editor.getNextKey()` behavior reads.
- The exported local `vi-mode` API from `fresh_pretty_vim`.

# What remains as appearance/profile behavior

- Mode chip based on `editor.getEditorMode()`.
- Scroll progress/percentage.
- Cursor position.
- Language label and Nerd Font file icon.
- Encoding display from `BufferInfo.encoding`, falling back to `UTF-8`.
- Hidden chrome, disabled cursor-jump animation, Markdown page view, Markdown wrap, and status bar layout in config.

# How the installed config enables Fresh built-in vi_mode

`config/config.json` enables Fresh's built-in plugin:

```json
"vi_mode": {
  "enabled": true,
  "settings": {
    "autoStart": true
  }
}
```

`fresh_pretty_vim` remains enabled separately as the appearance/statusline plugin.

# Compatibility notes

- Vim behavior now exactly follows the Fresh version installed by the user.
- `fresh_pretty_vim` no longer provides custom arrow-mode mappings, custom command-mode menus, custom command errors, or any fallback Vim behavior.
- If users need behavior changes, they should configure or patch Fresh built-in `vi_mode` upstream.

# Fresh vi_mode gaps, if any

No Fresh built-in `vi_mode` gap was identified that prevents preserving the appearance layer. See `docs/fresh-vi-mode-gaps.md`.

# Checks run

- `npx tsc --noEmit`
- Acceptance grep checks against `plugins/fresh_pretty_vim.ts`.
- `rg -n 'spawnProcess\\("file"' .`
