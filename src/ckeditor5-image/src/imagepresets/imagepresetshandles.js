import Plugin from '@ckeditor/ckeditor5-core/src/plugin';


export default class ImagePresetsHandles extends Plugin {
	/**
	 * @inheritDoc
	 */
	static get requires() {
		return [];
	}

	/**
	 * @inheritDoc
	 */
	static get pluginName() {
		return 'ImagePresetsHandles';
	}

	/**
	 * @inheritDoc
	 */
	init() {
		const editor = this.editor;
		const command = editor.commands.get('imagePresets');

		this.bind('isEnabled').to(command);

		editor.editing.downcastDispatcher.on('insert:image', ( evt, data, conversionApi ) => {
                        
			const widget = conversionApi.mapper.toViewElement(data.item);

		}, { priority: 'low' } );
	}
}