import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ImagePresetsButtons from './imagepresets/imagepresetsbuttons';
import ImagePresetsEditing from './imagepresets/imagepresetsediting';
import ImagePresetsHandles from './imagepresets/imagepresetshandles';

import '../theme/imagepresets.css';

export default class ImagePresets extends Plugin {
	/**
	 * @inheritDoc
	 */
	static get requires() {
		return [ImagePresetsEditing, ImagePresetsHandles, ImagePresetsButtons];
	}

	/**
	 * @inheritDoc
	 */
	static get pluginName() {
		return 'ImagePresets';
	}
}