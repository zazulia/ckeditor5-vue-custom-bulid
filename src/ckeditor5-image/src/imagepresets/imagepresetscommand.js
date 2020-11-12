import Command from '@ckeditor/ckeditor5-core/src/command';
import { isImage } from '@ckeditor/ckeditor5-image/src/image/utils';

export default class ImagePresetsCommand extends Command {

	refresh() {
		const element = this.editor.model.document.selection.getSelectedElement();

		this.isEnabled = isImage( element );

		if (isImage(element) && element.hasAttribute('src') ) {
			this.value = element.getAttribute('src');
		} else {
			this.value = false;
		}
	}

	execute(options) {
		const model = this.editor.model;
		const imageElement = model.document.selection.getSelectedElement();

		model.change( writer => {
			writer.setAttribute('src', options.newValue, imageElement );
		});
	}
}