# soksak-plugin-editor-format-json — JSON Formatter

A soksak plugin that cleans up `.json` files. It parses with `JSON.parse`, then re-emits
with `JSON.stringify(value, null, 2)` plus a single trailing newline.

## What It Does

- Depends on `soksak-plugin-editor-codemirror` and registers a JSON formatter through the editor's
  extension protocol (the `editor.ext.register` bus topic). The editor owns the engine
  (engine neutrality, contract A13); this plugin only supplies the format function.
- Valid JSON → returns the text reformatted with 2-space indentation.
- Broken JSON → does not modify the text at all; throws a `JSON parse failed: …` error.
  If the engine provides a position (`at position N`), it is converted to `line M col N`.

## Dependencies

`soksak-plugin-editor-codemirror` — provides the editor and its extension protocol. The skeleton
resolves and installs this dependency when this plugin is enabled.

## Permissions

None. The editor extension protocol rides on `app.bus` (plugin-to-plugin pub/sub), which
needs no permission.

## Usage

1. Enable `soksak-plugin-editor-codemirror` (auto-resolved as a dependency) and this plugin.
2. Open a `.json` file in the editor.
3. Run `editor.format` (the editor plugin's command). Result:
   - Valid JSON: reformatted with 2-space indentation + trailing newline. Undo (⌘Z) once
     to revert.
   - Broken JSON: a clear error such as `JSON parse failed: line 3 col 7 — …`. The buffer
     is not modified.
