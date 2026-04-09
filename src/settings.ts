import {App, PluginSettingTab, Setting} from "obsidian";
import EditWithVimPlugin from "./main";

export interface EditWithVimSettings {
	vimPath: string;
}

export const DEFAULT_SETTINGS: EditWithVimSettings = {
	vimPath: 'vim'
}

export class EditWithVimSettingTab extends PluginSettingTab {
	plugin: EditWithVimPlugin;

	constructor(app: App, plugin: EditWithVimPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName('Vim path')
			.setDesc('Path to the vim executable (e.g. /usr/bin/vim or just vim).')
			.addText(text => text
				.setPlaceholder('Vim')
				.setValue(this.plugin.settings.vimPath)
				.onChange(async (value) => {
					this.plugin.settings.vimPath = value;
					await this.plugin.saveSettings();
				}));
	}
}
