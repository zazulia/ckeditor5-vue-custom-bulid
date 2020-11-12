import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import SimpleUploadAdapter from '../../../ckeditor5-upload/src/adapters/simpleuploadadapter.js';
import ImagePresetsButtons from './imagepresetsbuttons';

export default class ImagePresetsHandles extends Plugin {
	/**
	 * @inheritDoc
	 */
	static get requires() {
		return [SimpleUploadAdapter, ImagePresetsButtons];
	}

	/**
	 * @inheritDoc
	 */
	static get pluginName() {
		return 'ImagePresetsHandles';
	}

	/**
	 * @inheritDoc
	 */
	init() {
		const editor = this.editor;
		const command = editor.commands.get('imagePresets');

		this.bind('isEnabled').to(command);

		editor.editing.downcastDispatcher.on('insert:image', ( evt, data, conversionApi ) => {
            
            console.log('insert:image');
            
            const simpleUploadAdapterPlugin = editor.plugins.get(SimpleUploadAdapter);
            const imagePresetsButtonsPlugin = editor.plugins.get(ImagePresetsButtons);

            simpleUploadAdapterPlugin.listenTo(simpleUploadAdapterPlugin, 'change:presetsOptions', function(evt, propName, newValue, oldValue) {
                                
                imagePresetsButtonsPlugin.initRemote(newValue);
                editor.execute('imagePresets');
            });
            

		}, { priority: 'low' } );
	}
}