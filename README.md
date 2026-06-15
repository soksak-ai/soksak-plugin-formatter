# soksak-plugin-formatter — JSON Formatter

A soksak example plugin that cleans up `.json` files with a single ⇧⌥F.
It parses with `JSON.parse`, then re-emits with `JSON.stringify(value, null, 2)` plus a
single trailing newline.

## What It Does

- Binds the formatter declared in the manifest (`json`, "JSON cleanup", target extension
  `json`) via `app.editor.registerFormatter`.
- Valid JSON → returns the text reformatted with 2-space indentation.
- Broken JSON → does not modify the text at all; throws a `JSON parse failed: …` error.
  If the engine provides a position (`at position N`), it is converted to `line M col N`
  format. The `editor.format` command surfaces this message as-is under INTERNAL (honest
  failure).

## Permission Rationale

| Permission | Reason |
|------|------|
| `editor` | The only surface needed for formatter registration (`registerFormatter`). No other surfaces (file/network/command) are used, so none are declared. |

## Installation

```bash
# Install from a local path (~/.soksak/plugins/soksak-plugin-formatter via copy/clone)
sok plugin.install '{"source":"/path/to/examples/plugins/soksak-plugin-formatter"}'

# Activation requires in-app human consent (remote enable is rejected with CONSENT_REQUIRED)
```

## Usage

1. Open a `.json` file in the editor.
2. Press ⇧⌥F (or run `sok editor.format`).
3. Result:
   - Valid JSON: reformatted with 2-space indentation + trailing newline. Undo (⌘Z) once
     to revert.
   - Non-`.json` file: `editor.format` responds with "no formatter" (this plugin only
     matches the `json` extension).
   - Broken JSON: a clear error such as `JSON parse failed: line 3 col 7 — …`. The buffer
     is not modified.
