import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import SimpleUploadAdapter from '../../../ckeditor5-upload/src/adapters/simpleuploadadapter.js';
import ImagePresetsButtons from './imagepresetsbuttons';

export default class ImagePresetsHandles extends Plugin {
	/**
	 * @inheritDoc
	 */
	static get requires() {
		return [SimpleUploadAdapter, ImagePresetsButtons];
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
            
            console.log('insert:image');
            
            const simpleUploadAdapterPlugin = editor.plugins.get(SimpleUploadAdapter);
            const imagePresetsButtonsPlugin = editor.plugins.get(ImagePresetsButtons);

            simpleUploadAdapterPlugin.listenTo(simpleUploadAdapterPlugin, 'change:presetsOptions', function(evt, propName, newValue, oldValue) {
                
                imagePresetsButtonsPlugin.initRemote(newValue);
                
                editor.ui.componentFactory.add('imagePresets', locale => {
                    
                    
                    const button = new ButtonView(locale);
                    const command = editor.commands.get('imagePresets');
                    const labelText = this._getOptionLabelValue(option, true);

                    if (!PRESETS_ICONS[icon]) {

                        throw new CKEditorError(
                            'imagepresetsbuttons-missing-icon',
                            editor,
                            option
                        );
                    }

                    button.set( {
                        // Use the `label` property for a verbose description (because of ARIA).
                        label: labelText,
                        icon: PRESETS_ICONS[icon],
                        tooltip: labelText,
                        isToggleable: true
                    } );

                    // Bind button to the command.
                    button.bind('isEnabled').to( this );
                    button.bind('isOn').to( command, 'value', getIsOnButtonCallback(optionValue));

                    this.listenTo(button, 'execute', () => {
                        editor.execute('imagePresets', {src: optionValue});
                    });
                    
                    
                    console.log(button);

                    return button;
                });
                
            });
			
		}, { priority: 'low' } );
	}
}