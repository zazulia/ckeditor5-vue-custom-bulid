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
        
		this.editor.model.schema.extend('image', {allowAttributes: ['preset', 'uuid'] });
        
		this.editor.model.schema.setAttributeProperties('uuid', {
			isFormatting: true
		});
        
		this.editor.model.schema.setAttributeProperties('preset', {
			isFormatting: true
		});
        
        
        
		editor.editing.downcastDispatcher.on('insert:image', ( evt, data, conversionApi ) => {
            
            const model = this.editor.model;
            const imageElement = model.document.selection.getSelectedElement();
            
            const simpleUploadAdapterPlugin = editor.plugins.get(SimpleUploadAdapter);
            
            simpleUploadAdapterPlugin.listenTo(simpleUploadAdapterPlugin, 'change:uuid', function(evt, propName, newValue, oldValue) {
                
                const viewWriter = conversionApi.writer;
                const figure = conversionApi.mapper.toViewElement(data.item);
                const img = figure.getChild(0);
                
                viewWriter.setAttribute('uuid', newValue, img);
                
                model.change( writer => {
                    writer.setAttribute('uuid', newValue, imageElement);
                });
                
            });
            
            simpleUploadAdapterPlugin.listenTo(simpleUploadAdapterPlugin, 'change:preset', function(evt, propName, newValue, oldValue) {
                
                const viewWriter = conversionApi.writer;
                const figure = conversionApi.mapper.toViewElement(data.item);
                const img = figure.getChild(0);
                
                viewWriter.setAttribute('preset', newValue, img);
                
                
                model.change( writer => {
                    writer.setAttribute('preset', newValue, imageElement);
                });
            });
            
        }, {priority: 'hight'});
    }
}