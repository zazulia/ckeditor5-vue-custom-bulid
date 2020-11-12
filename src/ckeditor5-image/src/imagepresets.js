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
        
		editor.editing.downcastDispatcher.on('insert:image', ( ...args ) => this.changeAfterInsert( ...args ), {priority: 'high'});
    }
    
    
    changeAfterInsert(evt, data, conversionApi) {
		const editor = this.editor;
		const modelImage = data.item;
        
		if (!conversionApi.consumable.consume(data.item, evt.name ) ) {
			return;
		}
        
        const viewWriter = conversionApi.writer;
        const viewFigure = editor.editing.mapper.toViewElement(modelImage);
        const viewImg = viewFigure ? viewFigure.getChild(0) : null;
        
        if(viewImg) {
            viewWriter.setAttribute('uuid', newValue, viewImg);
            
            model.change( writer => {
                writer.setAttribute('uuid', newValue, modelImage);
            });
            
            
            
            viewWriter.setAttribute('preset', newValue, viewImg);
            
            model.change( writer => {
                writer.setAttribute('preset', newValue, modelImage);
            });
        }
        
        
        
        /*const simpleUploadAdapterPlugin = editor.plugins.get(SimpleUploadAdapter);
        
        simpleUploadAdapterPlugin.listenTo(simpleUploadAdapterPlugin, 'change:uuid', function(evt, propName, newValue, oldValue) {
            
            const viewWriter = conversionApi.writer;
            const viewFigure = conversionApi.mapper.toViewElement(data.item);
            const img = figure.getChild(0);
            

            
        });
        
        simpleUploadAdapterPlugin.listenTo(simpleUploadAdapterPlugin, 'change:preset', function(evt, propName, newValue, oldValue) {
            
            const viewWriter = conversionApi.writer;
            const figure = conversionApi.mapper.toViewElement(data.item);
            const img = figure.getChild(0);
            
            viewWriter.setAttribute('preset', newValue, img);
            
            
            model.change( writer => {
                writer.setAttribute('preset', newValue, data.item);
            });
        });*/
            

    }
}