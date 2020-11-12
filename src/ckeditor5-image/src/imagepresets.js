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
            const selectedElement = editor.model.document.selection.getSelectedElement();
            
            simpleUploadAdapterPlugin.listenTo(simpleUploadAdapterPlugin, 'change:uuid', function(evt, propName, newValue, oldValue) {
                _this.changeUuid();
            });
            
        }, {priority: 'hight'});
    }
    
    changeUuid() {
        const editor = this.editor;        
    
        editor.model.schema.extend('image', {allowAttributes: 'uuid'});

        editor.conversion.for('upcast').attributeToAttribute( {
            view: 'uuid',
            model: 'uuid'
        } );

        editor.conversion.for('downcast').add( dispatcher => {
            
            dispatcher.on( 'attribute:uuid:image', ( evt, data, conversionApi ) => {
                if ( !conversionApi.consumable.consume( data.item, evt.name ) ) {
                    return;
                }

                const viewWriter = conversionApi.writer;
                const figure = conversionApi.mapper.toViewElement(data.item);
                const img = figure.getChild( 0 );

                if ( data.attributeNewValue !== null ) {
                    viewWriter.setAttribute('uuid', data.attributeNewValue, img);
                } else {
                    viewWriter.removeAttribute('uuid', img);
                }
            });
            
        });
    }
}