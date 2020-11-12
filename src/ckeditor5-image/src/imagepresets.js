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
        let _this = this;
        const editor = this.editor;
		const command = editor.commands.get('imagePresets');

		this.bind('isEnabled').to(command);
        
		editor.editing.downcastDispatcher.on('insert:image', ( evt, data, conversionApi ) => {
            
            const simpleUploadAdapterPlugin = editor.plugins.get(SimpleUploadAdapter);
            
            simpleUploadAdapterPlugin.listenTo(simpleUploadAdapterPlugin, 'change:uuid', function(evt, propName, newValue, oldValue) {
                
                const viewWriter = conversionApi.writer;
                const figure = conversionApi.mapper.toViewElement(data.item);
                const img = figure.getChild(0);
                
                viewWriter.setAttribute('uuid', newValue, img);

                
            });
            
        }, {priority: 'hight'});
    }
}