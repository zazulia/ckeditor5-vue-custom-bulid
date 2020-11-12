import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ImagePresetsEditing from './imagepresets/imagepresetsediting';
import ImagePresetsUI from './imagepresets/imagepresetsui';
import { isImage } from '@ckeditor/ckeditor5-image/src/image/utils';
import SimpleUploadAdapter from '../../ckeditor5-upload/src/adapters/simpleuploadadapter.js';

export default class ImagePresets extends Plugin {
	/**
	 * @inheritDoc
	 */
	static get requires() {
		return [ ImagePresetsEditing, ImagePresetsUI, SimpleUploadAdapter];
	}

	/**
	 * @inheritDoc
	 */
	static get pluginName() {
		return 'ImagePresets';
	}
    
    init() {
        const editor = this.editor;
		const command = editor.commands.get('imagePresets');

		this.bind('isEnabled').to(command);
        
		editor.editing.downcastDispatcher.on('insert:image', ( evt, data, conversionApi ) => {

            const simpleUploadAdapterPlugin = editor.plugins.get(SimpleUploadAdapter);
            const selectedElement = editor.model.document.selection.getSelectedElement();
            
            simpleUploadAdapterPlugin.listenTo(simpleUploadAdapterPlugin, 'change:uuid', function(evt, propName, newValue, oldValue) {
                editor.execute('imagePresets', {uuid: newValue} );
            });
            
        }, { priority: 'hight' });
    }
}