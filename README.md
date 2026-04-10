# Edit with Vim

Open the current Obsidian note in Vim from a command.

## Features

- Adds command: **Edit current note with vim**
- Opens the active note in a new terminal window using your configured Vim executable path
- Lets you configure the Vim executable path in plugin settings

## Requirements

- Obsidian desktop (plugin is desktop-only)
- Vim installed and available on your system

## Usage

1. Open a note in Obsidian.
2. Run the command palette action: **Edit current note with vim**.
3. The note opens in Vim in a terminal window.

## Settings

In **Settings → Community plugins → Edit with Vim**:

- **Vim path**: path to Vim executable (for example `vim`, `/usr/bin/vim`, or a custom binary path)

If left empty, the plugin defaults to `vim`.

## Platform behavior

- **macOS**: uses Terminal via AppleScript
- **Linux**: uses `x-terminal-emulator`
- **Windows**: launches through `cmd.exe`

If your platform is unsupported, the plugin shows a notice.

## Development

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
```

## Manual install

Copy these files into your vault plugin folder:

`<Vault>/.obsidian/plugins/edit-with-vim/`

- `main.js`
- `manifest.json`
- `styles.css` (if used)
