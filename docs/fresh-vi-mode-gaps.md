# Fresh built-in vi_mode gaps

This refactor delegates all Vim behavior to Fresh's built-in `vi_mode` plugin. The reference implementation inspected in `sinelaw/fresh` exposes the same `vi-*` editor mode names used by the statusline and supports `plugins.vi_mode.settings.autoStart`, so the appearance layer can preserve the current mode chip without reimplementing Vim behavior.

## Documented gaps

No Fresh built-in `vi_mode` gap was identified that prevents `fresh_pretty_vim` from preserving its runtime UI as an appearance/profile layer.

## Notes from the upstream inspection

- Fresh built-in `vi_mode` owns modal behavior and registers the `vi-normal`, `vi-insert`, `vi-operator-pending`, `vi-find-char`, `vi-visual`, `vi-visual-line`, `vi-visual-block`, and `vi-text-object` mode names.
- Fresh built-in `vi_mode` exposes an `autoStart` plugin setting; the installed configuration enables it with `plugins.vi_mode.settings.autoStart = true`.
- Any future behavioral mismatch should be fixed in Fresh built-in `vi_mode`, not in `fresh_pretty_vim`.
