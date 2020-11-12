import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ImagePresetsButtons from './imagepresetsbuttons';
import ImagePresetsEditing from './imagepresetsediting';
import ImagePresetsHandles from './imagepresetshandles';

import '../../theme/imagepresets.css';

export default class ImagePresetsMain extends Plugin {
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
		return 'ImagePresetsMain';
	}
}