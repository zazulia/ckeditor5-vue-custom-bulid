import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ImagePresetsEditing from './imagepresets/imagepresetsediting';
import ImagePresetsUI from './imagepresets/imagepresetsui';

export default class ImagePresets extends Plugin {
	/**
	 * @inheritDoc
	 */
	static get requires() {
		return [ ImagePresetsEditing, ImagePresetsUI ];
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

            const selectedElement = editor.model.document.selection.getSelectedElement();
            
                console.log(selectedElement);

			if ( isImage( selectedElement ) ) {
                
                console.log('selectedElement', selectedElement);
                
				/*editor.model.change( writer => {
					writer.setAttribute( 'src', imageInsertView.imageURLInputValue, selectedElement );
					writer.removeAttribute( 'srcset', selectedElement );
					writer.removeAttribute( 'sizes', selectedElement );
				} );*/
			} else {
				//editor.execute( 'imageInsert', { source: imageInsertView.imageURLInputValue } );
			}
            
        }, { priority: 'hight' });
    }
}