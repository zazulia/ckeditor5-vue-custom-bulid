import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ImagePresetsEditing from './imagepresets/imagepresetsediting';
import ImagePresetsUI from './imagepresets/imagepresetsui';

export default class ImagePresets extends Plugin {
	/**
	 * @inheritDoc
	 */
	static get requires() {
		return [ ImagePresetsEditing, ImagePresetsUI ];
	}

	/**
	 * @inheritDoc
	 */
	static get pluginName() {
		return 'ImagePresets';
	}
}