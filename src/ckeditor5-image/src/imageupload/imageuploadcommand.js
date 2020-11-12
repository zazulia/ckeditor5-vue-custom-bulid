import FileRepository from '@ckeditor/ckeditor5-upload/src/filerepository';
import Command from '@ckeditor/ckeditor5-core/src/command';
import { insertImage, isImageAllowed } from '@ckeditor/ckeditor5-image/src/image/utils';


export default class ImageUploadExtendCommand extends Command {

	refresh() {
		const imageElement = this.editor.model.document.selection.getSelectedElement();
		const isImage = imageElement && imageElement.name === 'image' || false;

		this.isEnabled = isImageAllowed( this.editor.model ) || isImage;
	}

	execute( options ) {
		const editor = this.editor;
		const model = editor.model;

		const fileRepository = editor.plugins.get( FileRepository );

		const filesToUpload = Array.isArray( options.file ) ? options.file : [ options.file ];

		for ( const file of filesToUpload ) {
			uploadImage( model, fileRepository, file );
		}
	}
}

function uploadImage( model, fileRepository, file ) {
	const loader = fileRepository.createLoader( file );

	// Do not throw when upload adapter is not set. FileRepository will log an error anyway.
	if ( !loader ) {
		return;
	}

	insertImage( model, { uploadId: loader.id } );
}
