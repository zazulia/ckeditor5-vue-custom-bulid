

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ImagePresetsMain from './imagepresets/imagepresetsmain';
import SimpleUploadAdapter from '../../ckeditor5-upload/src/adapters/simpleuploadadapter.js';

export default class ImagePresets extends Plugin {
	static get requires() {
		return [ImagePresetsMain, SimpleUploadAdapter];
	}
	static get pluginName() {
		return 'ImagePresets';
	}
    
	init() {
        const _this = this;
		const editor = this.editor;

		editor.editing.downcastDispatcher.on('insert:image', ( evt, data, conversionApi ) => {
            
            console.log('insert:image');
            
            const simpleUploadAdapterPlugin = editor.plugins.get(SimpleUploadAdapter);
            
            const command = editor.commands.get('imagePresets');
            _this.bind('isEnabled').to(command);

            simpleUploadAdapterPlugin.listenTo(simpleUploadAdapterPlugin, 'change:presetsOptions', function(evt, propName, newValue, oldValue) {
                                
                _this.initPresets();
            });
            

		}, { priority: 'low' } );
	}
    
    initPresets(options) {
                
		const plugins = this.config.get('plugins');
		plugins.push(ImagePresetsMain);

		this.config.set('plugins', plugins);

		this.config.define('image.presetsOptions', options);

		this.editor.data.processor = new HtmlDataProcessor(this.editor.data.viewDocument);
        this.editor.model.document.createRoot();
        
    }
}