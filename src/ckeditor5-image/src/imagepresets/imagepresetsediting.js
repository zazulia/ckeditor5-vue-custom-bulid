import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ImagePresetsCommand from './imagepresetscommand';

export default class ImagePresetsEditing extends Plugin {

	static get pluginName() {
		return 'ImagePresetsEditing';
	}

	init() {
		this.editor.commands.add('imagePresets', new ImagePresetsCommand(this.editor));
	}
}