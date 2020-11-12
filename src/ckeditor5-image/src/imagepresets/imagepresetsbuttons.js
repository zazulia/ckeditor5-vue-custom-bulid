import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
import ImagePresetsEditing from './imagepresetsediting';
import {createDropdown, addListToDropdown } from '@ckeditor/ckeditor5-ui/src/dropdown/utils';
import DropdownButtonView from '@ckeditor/ckeditor5-ui/src/dropdown/button/dropdownbuttonview';

import Model from '@ckeditor/ckeditor5-ui/src/model';
import Collection from '@ckeditor/ckeditor5-utils/src/collection';

import CKEditorError from '@ckeditor/ckeditor5-utils/src/ckeditorerror';

import iconSmall from '@ckeditor/ckeditor5-core/theme/icons/object-size-small.svg';
import iconMedium from '@ckeditor/ckeditor5-core/theme/icons/object-size-medium.svg';
import iconLarge from '@ckeditor/ckeditor5-core/theme/icons/object-size-large.svg';
import iconFull from '@ckeditor/ckeditor5-core/theme/icons/object-size-full.svg';

const PRESETS_ICONS = {
	small: iconSmall,
	medium: iconMedium,
	large: iconLarge,
	original: iconFull
};

export default class ImagePresetsButtons extends Plugin {
	/**
	 * @inheritDoc
	 */
	static get requires() {
		return [ImagePresetsEditing];
	}

	/**
	 * @inheritDoc
	 */
	static get pluginName() {
		return 'ImagePresetsButtons';
	}

	/**
	 * @inheritDoc
	 */
	constructor(editor) {
		super(editor);
	}

	/**
	 * @inheritDoc
	 */
	init() {
        
	}
    
	initRemote(options) {
        
		const editor = this.editor;
		const command = editor.commands.get('imagePresets');

		this.bind('isEnabled').to(command);

        if (options.length) {
            for (const option of options) {
                this._registerImagePresetsButton(option);
            }

            this._registerImagePresetsDropdown(options);
        }
	}

	_registerImagePresetsButton( option ) {
        

        
		const editor = this.editor;
		const { name, value, icon } = option;
		const optionValue = value ? value : null;

		editor.ui.componentFactory.add( name, locale => {
			const button = new ButtonView( locale );
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
			} );

			return button;
		});
	}

	_registerImagePresetsDropdown( options ) {
		const editor = this.editor;
		const t = editor.t;
		const originalSizeOption = options.find(option => !option.value);

		// Register dropdown.
		editor.ui.componentFactory.add('imagePresets', locale => {
			const command = editor.commands.get('imagePresets');
			const dropdownView = createDropdown(locale, DropdownButtonView);
			const dropdownButton = dropdownView.buttonView;

			dropdownButton.set( {
				tooltip: t('Presets image'),
				commandValue: originalSizeOption.value,
				icon: iconMedium,
				isToggleable: true,
				label: this._getOptionLabelValue( originalSizeOption ),
				withText: true,
				class: 'ck-presets-image-button'
			} );

			dropdownButton.bind('label').to(command, 'value', commandValue => {
				if (commandValue && commandValue.width) {
					return commandValue.width;
				} else {
					return this._getOptionLabelValue(originalSizeOption);
				}
			} );
			dropdownView.bind('isOn').to(command);
			dropdownView.bind('isEnabled').to(this);

			addListToDropdown(dropdownView, this._getPresetsDropdownListItemDefinitions(options, command));

			dropdownView.listView.ariaLabel = t('Image presets list');

			// Execute command when an item from the dropdown is selected.
			this.listenTo(dropdownView, 'execute', evt => {
				editor.execute(evt.source.commandName, {width: evt.source.commandValue});
				editor.editing.view.focus();
			});

			return dropdownView;
		} );
	}

	_getOptionLabelValue(option, forTooltip) {
		const t = this.editor.t;

		if (option.label) {
			return option.label;
		} else if (forTooltip) {
			if (option.value) {
				return t('Set image preset to', option.value);
			} else {
				return t('Set image preset to default');
			}
		} else {
			if ( option.value ) {
				return option.value;
			} else {
				return t('Default');
			}
		}
	}

	_getPresetsDropdownListItemDefinitions(options, command) {
		const itemDefinitions = new Collection();

		options.map(option => {
			const optionValueWithUnit = option.value ? option.value : null;
			const definition = {
				type: 'button',
				model: new Model({
					commandName: 'imagePresets',
					commandValue: optionValueWithUnit,
					label: this._getOptionLabelValue( option ),
					withText: true,
					icon: null
				})
			};

			definition.model.bind('isOn').to( command, 'value', getIsOnButtonCallback(optionValueWithUnit));

			itemDefinitions.add(definition);
		});

		return itemDefinitions;
	}
}

// A helper function for setting the `isOn` state of buttons in value bindings.
function getIsOnButtonCallback( value ) {
	return commandValue => {
		if ( value === null && commandValue === value ) {
			return true;
		}

		return commandValue && commandValue.width === value;
	};
}