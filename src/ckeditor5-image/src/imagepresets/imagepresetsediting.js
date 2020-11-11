import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ImagePresetsCommand from './imagepresetscommand';

export default class ImagePresetsEditing extends Plugin {
	/**
	 * @inheritDoc
	 */
	static get pluginName() {
		return 'ImagePresetsEditing';
	}

	/**
	 * @inheritDoc
	 */
	constructor( editor ) {
		super( editor );

		editor.config.define('image', {
			presetsOptions: []
		});
	}

	/**
	 * @inheritDoc
	 */
	init() {
		const editor = this.editor;
		const command = new ImagePresetsCommand(editor);

		this._registerSchema();
		this._registerConverters();

		editor.commands.add('imagePresets', command);
	}

	/**
	 * @private
	 */
	_registerSchema() {
		this.editor.model.schema.extend('image', {allowAttributes: 'src'});
		this.editor.model.schema.setAttributeProperties('src', {
			isFormatting: true
		});
	}


	_registerConverters() {
		const editor = this.editor;

		// Dedicated converter to propagate image's attribute to the img tag.
		editor.conversion.for('downcast').add(dispatcher =>
			dispatcher.on('attribute:src:image', ( evt, data, conversionApi ) => {
				if ( !conversionApi.consumable.consume(data.item, evt.name)) {
					return;
				}

				const viewWriter = conversionApi.writer;
				const figure = conversionApi.mapper.toViewElement(data.item);

				if (data.attributeNewValue !== null ) {
					viewWriter.setAttribute('src', data.attributeNewValue, figure);
				} else {
					viewWriter.removeAttribute('src', figure);
				}
			} )
		);

		editor.conversion.for('upcast')
			.attributeToAttribute({
				view: {
					name: 'figure',
                    key: 'src',
					value: viewElement => viewElement.getAttribute('src')
				},
				model: {
					key: 'src',
					value: viewElement => viewElement.getAttribute('src')
				}
			});
	}
}