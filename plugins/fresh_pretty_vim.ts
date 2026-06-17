/// <reference path="../types/fresh.d.ts" />
const editor = getEditor();

/**
 * fresh_pretty_vim appearance/profile plugin.
 *
 * Fresh's built-in `vi_mode` plugin owns all modal editing behavior. This
 * plugin only contributes the pretty statusline/profile presentation around the
 * active Fresh editor mode.
 */

function animateStatuslineRight(from: PluginAnimationEdge = "right", durationMs = 90): void {
  try {
    const screen = editor.getScreenSize();
    const width = Math.min(screen.width, 46);
    editor.animateArea(
      {
        x: Math.max(0, screen.width - width),
        y: Math.max(0, screen.height - 1),
        width,
        height: 1,
      },
      { kind: "slideIn", from, durationMs, delayMs: 0 },
    );
  } catch (err) {
    editor.debug(`fresh_pretty_vim right animation: ${String(err)}`);
  }
}

// Compact statusline
// ============================================================================

const MODE_TOKEN = "mode";
const INFO_TOKEN = "info";
const POSITION_TOKEN = "position";

const VIM_ICON = "";

const FILE_ICONS: Record<string, string> = {
  markdown: "",
  multimarkdown: "",
  text: "󰈙",
  json: "",
  yaml: "",
  toml: "",
  lua: "",
  typescript: "",
  javascript: "",
  python: "",
  rust: "",
  go: "",
  java: "",
  kotlin: "",
  c: "",
  cpp: "",
  bash: "",
  sh: "",
};

const LANGUAGE_LABELS: Record<string, string> = {
  markdown: "Markdown",
  multimarkdown: "Markdown",
  text: "Text",
  json: "JSON",
  yaml: "YAML",
  toml: "TOML",
  lua: "Lua",
  typescript: "TypeScript",
  javascript: "JavaScript",
  python: "Python",
  rust: "Rust",
  go: "Go",
  java: "Java",
  kotlin: "Kotlin",
  c: "C",
  cpp: "C++",
  bash: "Shell",
  sh: "Shell",
};

function iconFor(language: string): string {
  return FILE_ICONS[language] ?? "󰈔";
}

function languageLabel(language: string): string {
  return `${iconFor(language)} ${LANGUAGE_LABELS[language] ?? language}`;
}

function modeLabel(): string {
  const mode = editor.getEditorMode?.() ?? "";
  switch (mode) {
    case "vi-normal":
      return `${VIM_ICON} NORMAL`;
    case "vi-insert":
      return `${VIM_ICON} INSERT`;
    case "vi-visual":
      return `${VIM_ICON} VISUAL`;
    case "vi-visual-line":
      return `${VIM_ICON} V-LINE`;
    case "vi-visual-block":
      return `${VIM_ICON} V-BLOCK`;
    case "vi-operator-pending":
      return `${VIM_ICON} OPERATOR`;
    case "vi-find-char":
      return `${VIM_ICON} FIND`;
    case "vi-text-object":
      return `${VIM_ICON} TEXTOBJ`;
    default:
      return `${VIM_ICON} READY`;
  }
}

type PrettyPosition = {
  line: number;
  col: number;
};

function positionText(position: PrettyPosition | null): string {
  if (!position) return "--,--";
  return `${position.line},${position.col}`;
}

async function currentPosition(): Promise<PrettyPosition | null> {
  const cursor = editor.getPrimaryCursor?.();
  if (!cursor || cursor.line === null) {
    return null;
  }

  const lineStart = await editor.getLineStartPosition(cursor.line);
  const col = lineStart === null ? 1 : Math.max(1, cursor.position - lineStart + 1);
  return { line: cursor.line + 1, col };
}

let lastBufferId = 0;
let lastModeValue = "";
let lastInfoValue = "";
let lastPositionValue = "";
let lastFallbackAt = 0;
let updateSerial = 0;
let lastActualPosition: PrettyPosition | null = null;
let lastPositionFloatAt = 0;

function infoValueFor(lang: string, positionValue: string): string {
  return `${languageLabel(lang)} ${positionValue}`;
}

function shouldFloatPosition(from: PrettyPosition | null, to: PrettyPosition | null): boolean {
  if (!from || !to) return false;
  return Math.abs(from.line - to.line) > 2 || Math.abs(from.col - to.col) > 8;
}

function animatePositionFloat(): void {
  const now = Date.now();
  if (now - lastPositionFloatAt < 90) return;
  lastPositionFloatAt = now;
  animateStatuslineRight("right", 95);
}

async function updatePrettyStatus(force = false): Promise<void> {
  const serial = ++updateSerial;
  const bufferId = editor.getActiveBufferId();
  if (!bufferId) return;

  const info = editor.getBufferInfo(bufferId);
  if (!info) return;

  if (bufferId !== lastBufferId) {
    lastBufferId = bufferId;
    lastModeValue = "";
    lastInfoValue = "";
    lastPositionValue = "";
    lastActualPosition = null;
    lastPositionFloatAt = 0;
  }

  const lang = info.language || "text";
  const modeValue = modeLabel();
  const targetPosition = await currentPosition();

  // Drop stale async cursor/line calculations if another event arrived first.
  if (serial !== updateSerial) return;

  const shouldAnimatePosition = !force && shouldFloatPosition(lastActualPosition, targetPosition);
  lastActualPosition = targetPosition;

  const positionValue = positionText(targetPosition);
  const infoValue = infoValueFor(lang, positionValue);

  if (force || modeValue !== lastModeValue) {
    editor.setStatusBarValue(bufferId, MODE_TOKEN, modeValue);
    lastModeValue = modeValue;
  }
  if (force || infoValue !== lastInfoValue) {
    editor.setStatusBarValue(bufferId, INFO_TOKEN, infoValue);
    lastInfoValue = infoValue;
    if (shouldAnimatePosition) {
      animatePositionFloat();
    }
  }
  if (force || positionValue !== lastPositionValue) {
    editor.setStatusBarValue(bufferId, POSITION_TOKEN, positionValue);
    lastPositionValue = positionValue;
  }
}

function scheduleUpdate(): void {
  updatePrettyStatus(false).catch((err) => {
    editor.debug(`fresh_pretty_vim statusline: ${String(err)}`);
  });
}

function fallbackUpdate(): void {
  const now = Date.now();
  if (now - lastFallbackAt < 80) return;
  lastFallbackAt = now;
  scheduleUpdate();
}

editor.registerStatusBarElement(MODE_TOKEN, "Pretty Mode");
editor.registerStatusBarElement(INFO_TOKEN, "Pretty Info");
editor.registerStatusBarElement(POSITION_TOKEN, "Pretty Position");

[
  "buffer_activated",
  "after_file_open",
  "after_file_save",
  "cursor_moved",
  "viewport_changed",
  "after_insert",
  "after_delete",
  "pre_command",
  "post_command",
  "language_changed",
].forEach((eventName) => {
  editor.on(eventName as keyof HookEventMap, scheduleUpdate);
});

// Some built-in vi_mode transitions only call setEditorMode internally and do
// not move the cursor. A light render-start fallback keeps the mode chip
// responsive without spamming status-bar writes; values are cached above.
editor.on("render_start", fallbackUpdate);

updatePrettyStatus(true).catch((err) => {
  editor.debug(`fresh_pretty_vim statusline init: ${String(err)}`);
});
editor.debug("fresh_pretty_vim appearance statusline loaded");
