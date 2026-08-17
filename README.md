# RJSF Schema Preview

A VS Code extension that previews JSON Schema as an interactive React form using [react-jsonschema-form (RJSF)](https://github.com/rjsf-team/react-jsonschema-form).

## Features

- Live preview of JSON Schema as a form — updates as you type
- Multiple UI themes: Default, Fluent UI (Light / Dark)
- Displays submitted form data as JSON

<!-- TODO: Add screenshot here -->
<!-- ![screenshot](images/screenshot.png) -->

## Installation

This extension is not published to the Marketplace. Build a `.vsix` locally and install it — no debug run (F5) required.

```bash
npm install
npm run install:local   # package the .vsix and install it into VS Code
```

Then reload the window (`Ctrl+Shift+P` → **Developer: Reload Window**).

Notes:

- `npm run package` only produces `rjsf-preview.vsix` without installing.
- `npm run install:local` uses `--force`, so re-running it overwrites the same version. Use it after every code change, followed by a window reload.
- With Remote-WSL, `code --install-extension` installs into the **WSL side**; the extension will not be active in windows opened on Windows-local folders. To install there too, use the Extensions view → **…** → **Install from VSIX…** with the same `rjsf-preview.vsix`.
- To uninstall: `code --uninstall-extension local.rjsf-preview`

## Usage

1. Open a JSON Schema file (filename must match `schema*.json` or `*schema.json`)
2. Click the preview icon in the editor title bar, or run the command **"Open RJSF Form Preview"** from the Command Palette (`Cmd+Shift+P`)
3. The form preview opens in a side panel and updates in real time

## Requirements

No additional setup required.

## Extension Settings

| Setting | Type | Default | Description |
| --- | --- | --- | --- |
| `rjsf-preview.defaultTheme` | `"default"` \| `"fluent-light"` \| `"fluent-dark"` | `"default"` | Default UI theme for the form preview. `default` is the built-in RJSF theme; the others use Fluent UI (Light / Dark). |

The theme can also be switched from the preview panel; this setting only controls which one is selected when a preview opens.

## Known Issues

<!-- TODO: List known issues -->

## Release Notes

### 0.1.0

Initial release.

## License

MIT
