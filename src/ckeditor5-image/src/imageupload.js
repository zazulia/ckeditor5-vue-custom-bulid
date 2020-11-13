import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ImageUploadUI from './imageupload/imageuploadui';
import ImageUploadProgress from './imageupload/imageuploadprogress';
import ImageUploadEditing from './imageupload/imageuploadediting';

export default class ImageUpload extends Plugin {
	/**
	 * @inheritDoc
	 */
	static get pluginName() {
		return 'ImageUploadExtend';
	}

	/**
	 * @inheritDoc
	 */
	static get requires() {
		return [ ImageUploadEditing, ImageUploadUI, ImageUploadProgress ];
	}
}