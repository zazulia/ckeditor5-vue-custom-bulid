import Command from '@ckeditor/ckeditor5-core/src/command';
import { isImage } from '@ckeditor/ckeditor5-image/src/image/utils';

export default class ImagePresetsCommand extends Command {
	/**
	 * @inheritDoc
	 */
	refresh() {
		const element = this.editor.model.document.selection.getSelectedElement();

		this.isEnabled = isImage( element );

		if ( !element || !element.hasAttribute('src') ) {
			this.value = null;
		} else {
			this.value = {
				src: element.getAttribute('src')
			};
		}
	}

	execute(options) {
		const model = this.editor.model;
		const imageElement = model.document.selection.getSelectedElement();

		this.value = {
			src: options.src,
		};

		if (imageElement) {
			model.change(writer => {
               
				writer.setAttribute('src', options.src, imageElement);
			});
		}
	}
}