import {FileSystemAdapter, Notice, Plugin, TFile} from 'obsidian';
import {join} from 'path';
import {spawn} from 'child_process';
import {platform} from 'os';
import {DEFAULT_SETTINGS, EditWithVimSettings, EditWithVimSettingTab} from "./settings";

export default class EditWithVimPlugin extends Plugin {
	settings: EditWithVimSettings;

	async onload() {
		await this.loadSettings();

		this.addCommand({
			id: 'edit-current-note-with-vim',
			name: 'Edit current note with vim',
			checkCallback: (checking: boolean) => {
				const file = this.app.workspace.getActiveFile();
				if (file) {
					if (!checking) {
						this.editWithVim(file);
					}
					return true;
				}
				return false;
			}
		});

		this.addSettingTab(new EditWithVimSettingTab(this.app, this));
	}

	onunload() {}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData() as Partial<EditWithVimSettings>);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	private editWithVim(file: TFile): void {
		const adapter = this.app.vault.adapter;
		if (!(adapter instanceof FileSystemAdapter)) {
			new Notice('Edit with vim requires a local vault.');
			return;
		}

		const filePath = join(adapter.getBasePath(), file.path);
		const vimPath = (this.settings.vimPath || '').trim() || 'vim';
		const os = platform();

		// Escape a string for use inside an AppleScript double-quoted string
		const appleScriptEscape = (s: string) =>
			s.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n').replace(/\r/g, '');

		let child: ReturnType<typeof spawn>;
		if (os === 'darwin') {
			const script = `tell application "Terminal"
activate
do script "${appleScriptEscape(vimPath)} \\"${appleScriptEscape(filePath)}\\""
end tell`;
			child = spawn('osascript', ['-e', script], {detached: true, stdio: 'ignore'});
		} else if (os === 'linux') {
			child = spawn('x-terminal-emulator', ['-e', vimPath, filePath], {detached: true, stdio: 'ignore'});
		} else if (os === 'win32') {
			// Pass vimPath and filePath as separate arguments so cmd.exe does not interpret them
			child = spawn('cmd.exe', ['/c', 'start', 'cmd.exe', '/k', vimPath, filePath], {detached: true, stdio: 'ignore'});
		} else {
			new Notice(`Unsupported platform: ${os}`);
			return;
		}

		child.on('error', (err: Error) => {
			new Notice(`Failed to open vim: ${err.message}`);
		});
		child.unref();
	}
}
