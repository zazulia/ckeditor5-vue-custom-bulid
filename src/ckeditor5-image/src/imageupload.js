/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @module image/imageupload
 */

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ImageUploadExtendUI from './imageupload/imageuploadui';
import ImageUploadExtendProgress from './imageupload/imageuploadprogress';
import ImageUploadExtendEditing from './imageupload/imageuploadediting';


export default class ImageUploadExtend extends Plugin {
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
		return [ ImageUploadExtendEditing, ImageUploadExtendUI, ImageUploadExtendProgress ];
	}
}

/**
 * The image upload configuration.
 *
 * @member {module:image/imageupload~ImageUploadConfig} module:image/image~ImageConfig#upload
 */

/**
 * The configuration of the image upload feature. Used by the image upload feature in the `@ckeditor/ckeditor5-image` package.
 *
 *		ClassicEditor
 *			.create( editorElement, {
 * 				image: {
 * 					upload:  ... // Image upload feature options.
 * 				}
 *			} )
 *			.then( ... )
 *			.catch( ... );
 *
 * See {@link module:core/editor/editorconfig~EditorConfig all editor options}.
 *
 * @interface module:image/imageupload~ImageUploadConfig
 */

/**
 * The list of accepted image types.
 *
 * The accepted types of images can be customized to allow only certain types of images:
 *
 *		// Allow only JPEG and PNG images:
 *		const imageUploadConfig = {
 *			types: [ 'png', 'jpeg' ]
 *		};
 *
 * The type string should match [one of the sub-types](https://www.iana.org/assignments/media-types/media-types.xhtml#image)
 * of the image MIME type. For example, for the `image/jpeg` MIME type, add `'jpeg'` to your image upload configuration.
 *
 * **Note:** This setting only restricts some image types to be selected and uploaded through the CKEditor UI and commands. Image type
 * recognition and filtering should also be implemented on the server which accepts image uploads.
 *
 * @member {Array.<String>} module:image/imageupload~ImageUploadConfig#types
 * @default [ 'jpeg', 'png', 'gif', 'bmp', 'webp', 'tiff' ]
 */
