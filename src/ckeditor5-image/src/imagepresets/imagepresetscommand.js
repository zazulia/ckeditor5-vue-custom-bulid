import Command from '@ckeditor/ckeditor5-core/src/command';
import { isImage } from '@ckeditor/ckeditor5-image/src/image/utils';

export default class ImagePresetsCommand extends Command {

	refresh() {
		const element = this.editor.model.document.selection.getSelectedElement();

		this.isEnabled = isImage( element );
        
        this.value = {};

		if (isImage(element) && element.hasAttribute('src') ) {
			this.value['src'] = element.getAttribute('src');
		} else {
			this.value = null;
		}
        
		if (isImage(element) && element.hasAttribute('data-preset') ) {
			this.value['data-preset'] = element.getAttribute('data-preset');
		} else {
            if (!this.value || !this.value.hasOwnProperty('src')) {
                this.value = null;
            }
		}
	}

	execute(options) {
		const model = this.editor.model;
		const imageElement = model.document.selection.getSelectedElement();

        if ( imageElement ) {
            model.change( writer => {
                if (options.newValue.hasOwnProperty('src')) {
                    writer.setAttribute('src', options.newValue.src, imageElement);
                }
                
                if (options.newValue.hasOwnProperty('data-preset')) {
                    writer.setAttribute('data-preset', options.newValue['data-preset'], imageElement);
                }
            });
        }
	}
}