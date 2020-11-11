/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @module upload/adapters/simpleuploadadapter
 */

/* globals XMLHttpRequest, FormData */

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import FileRepository from '@ckeditor/ckeditor5-upload/src/filerepository';
import {logWarning} from '@ckeditor/ckeditor5-utils/src/ckeditorerror';

/**
 * The Simple upload adapter allows uploading images to an application running on your server using
 * the [`XMLHttpRequest`](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest) API with a
 * minimal {@link module:upload/adapters/simpleuploadadapter~SimpleUploadConfig editor configuration}.
 *
 *        ClassicEditor
 *            .create( document.querySelector( '#editor' ), {
 *				simpleUpload: {
 *					uploadUrl: 'http://example.com',
 *					headers: {
 *						...
 *					}
 *				}
 *			} )
 *            .then( ... )
 *            .catch( ... );
 *
 * See the {@glink features/image-upload/simple-upload-adapter "Simple upload adapter"} guide to learn how to
 * learn more about the feature (configuration, server–side requirements, etc.).
 *
 * Check out the {@glink features/image-upload/image-upload comprehensive "Image upload overview"} to learn about
 * other ways to upload images into CKEditor 5.
 *
 * @extends module:core/plugin~Plugin
 */
export default class SimpleUploadAdapter extends Plugin {
    /**
     * @inheritDoc
     */
    static get requires() {
        return [FileRepository];
    }

    /**
     * @inheritDoc
     */
    static get pluginName() {
        return 'SimpleUploadAdapter';
    }

    /**
     * @inheritDoc
     */
    init() {
        const options = this.editor.config.get('simpleUpload');

        if (!options) {
            return;
        }

        if (!options.uploadUrl) {
            /**
             * The {@link module:upload/adapters/simpleuploadadapter~SimpleUploadConfig#uploadUrl `config.simpleUpload.uploadUrl`}
             * configuration required by the {@link module:upload/adapters/simpleuploadadapter~SimpleUploadAdapter `SimpleUploadAdapter`}
             * is missing. Make sure the correct URL is specified for the image upload to work properly.
             *
             * @error simple-upload-adapter-missing-uploadurl
             */
            logWarning('simple-upload-adapter-missing-uploadurl');

            return;
        }

        this.editor.plugins.get(FileRepository).createUploadAdapter = loader => {
            return new Adapter(loader, options);
        };
    }
}

/**
 * Upload adapter.
 *
 * @private
 * @implements module:upload/filerepository~UploadAdapter
 */
class Adapter {
    /**
     * Creates a new adapter instance.
     *
     * @param {module:upload/filerepository~FileLoader} loader
     * @param {module:upload/adapters/simpleuploadadapter~SimpleUploadConfig} options
     */
    constructor(loader, options) {
        /**
         * FileLoader instance to use during the upload.
         *
         * @member {module:upload/filerepository~FileLoader} #loader
         */
        this.loader = loader;

        /**
         * The configuration of the adapter.
         *
         * @member {module:upload/adapters/simpleuploadadapter~SimpleUploadConfig} #options
         */
        this.options = options;
    }

    /**
     * Starts the upload process.
     *
     * @see module:upload/filerepository~UploadAdapter#upload
     * @returns {Promise}
     */
    upload() {
        return this.loader.file
            .then(file => new Promise((resolve, reject) => {
                this._initRequest();
                this._initListeners(resolve, reject, file);
                this._sendRequest(file);
            }));
    }

    /**
     * Aborts the upload process.
     *
     * @see module:upload/filerepository~UploadAdapter#abort
     * @returns {Promise}
     */
    abort() {
        if (this.xhr) {
            this.xhr.abort();
        }
        
        if (this.xhrLoad) {
            this.xhrLoad.abort();
        }
    }

    /**
     * Initializes the `XMLHttpRequest` object using the URL specified as
     * {@link module:upload/adapters/simpleuploadadapter~SimpleUploadConfig#uploadUrl `simpleUpload.uploadUrl`} in the editor's
     * configuration.
     *
     * @private
     */
    _initRequest() {
        this.xhr = new XMLHttpRequest();
        this.xhrLoad = new XMLHttpRequest();
    }

    /**
     * Initializes XMLHttpRequest listeners
     *
     * @private
     * @param {Function} resolve Callback function to be called when the request is successful.
     * @param {Function} reject Callback function to be called when the request cannot be completed.
     * @param {File} file Native File object.
     */
    _initListeners(resolve, reject, file) {
        let _this = this;

        const loader = this.loader;
        const genericErrorText = `Couldn't upload file: ${file.name}.`;

        this.xhr.addEventListener('error', () => reject(genericErrorText));
        
        this.xhr.addEventListener('abort', () => reject());
        
        this.xhr.addEventListener('load', () => {
            const response = JSON.parse(_this.xhr.response);

            if (!_this.xhr.response || (response.hasOwnProperty('status') && (response.status === 'ERROR' || response.status === 'EXEPTION'))) {
                return reject(_this.xhr.response && response.hasOwnProperty('message') && response.message ? response.message : genericErrorText);
            }
                        
            console.log(response, typeof response);
            
            if (response.hasOwnProperty('data') && response.data.hasOwnProperty('uuid') && response.data.uuid) {
                _this._sendRequestLoad(resolve, reject, file, response.data.uuid);
            } else {
                reject(genericErrorText);
            }
        });

        // Upload progress when it is supported.
        /* istanbul ignore else */
        if (this.xhr.upload) {
            this.xhr.upload.addEventListener('progress', evt => {
                if (evt.lengthComputable) {
                    loader.uploadTotal = evt.total;
                    loader.uploaded = evt.loaded;
                }
            });
        }
    }
    
    _initListenersLoad(resolve, reject, file, uuid) {
        let _this = this;

        const loader = this.loader;
        const genericErrorText = `Couldn't load file: ${file.name}.`;
        
        const presets = this.options.presets.length ? opts.presets : [];

        this.xhrLoad.addEventListener('error', () => reject(genericErrorText));
        
        this.xhrLoad.addEventListener('abort', () => reject());
        
        this.xhrLoad.addEventListener('load', () => {
            const response = JSON.parse(_this.xhrLoad.response);

            if (!_this.xhr.response || (response.hasOwnProperty('status') && (response.status === 'ERROR' || response.status === 'EXEPTION'))) {
                return reject(_this.xhr.response && response.hasOwnProperty('message') && response.message ? response.message : genericErrorText);
            }
                        
            if (response.hasOwnProperty('data') && response.data.hasOwnProperty('files')) {
                
                let files = response.data.files;
                let urls = [];
                
                for (let index in files) {
                    
                    for (let indexPreset in presets) {
                        let linkStr = _thisthis.getLink(files[index][presets[indexPreset]].links);
                        urls.push(linkStr);
                    }
                }
                
                if (urls.length) {
                    resolve(urls.length === 1 ? {default: urls[0]} : urls);
                } else {
                    reject(genericErrorText);
                }
                
            } else {
                reject(genericErrorText);
            }
        });

        // Upload progress when it is supported.
        /* istanbul ignore else */
        if (this.xhrLoad.upload) {
            this.xhrLoad.upload.addEventListener('progress', evt => {
                if (evt.lengthComputable) {
                    loader.uploadTotal = evt.total;
                    loader.uploaded = evt.loaded;
                }
            });
        }
    }

    /**
     * Prepares the data and sends the request.
     *
     * @private
     * @param {File} file File instance to be uploaded.
     */
    _sendRequest(file) {
        
        const data = this._createFormUpload(file, this.options);
        
        this.xhr.open('POST', this.options.uploadUrl, true);
        
        this.xhr.responseType = this.options.responseType || '';
        
        // Set headers if specified.
        const headers = this.options.headers || {};

        // Use the withCredentials flag if specified.
        const withCredentials = this.options.withCredentials || false;

        Object.keys(headers).forEach((headerName) => {
            this.xhr.setRequestHeader(headerName, headers[headerName]);
        });

        this.xhr.withCredentials = withCredentials;

        // Send the request.
        this.xhr.send(data);
    }
    
    
    _sendRequestLoad(resolve, reject, file, uuid) {
        
        this._initListenersLoad(resolve, reject, file, uuid);
        
        const data = this._createFormLoad(file, this.options);
                
        this.xhrLoad.open('GET', this.options.loadUrl, true);
                
        // Set headers if specified.
        const headers = this.options.headers || {};

        // Use the withCredentials flag if specified.
        const withCredentials = this.options.withCredentials || false;

        Object.keys(headers).forEach((headerName) => {
            this.xhrLoad.setRequestHeader(headerName, headers[headerName]);
        });

        this.xhrLoad.withCredentials = withCredentials;

        // Send the request.
        this.xhrLoad.send(data);
    }
    
    _createFormLoad(uuid, opts) {
        
        const data = {};
        
        data.files = [uuid];
        data.fileinfo = opts.fileInfo ? opts.fileInfo : false;
        data.presets = opts.presets.length ? opts.presets : ['original'];

        
        return data;
    }
    
    
    _createFormUpload(file, opts) {
        
        const formPost = new FormData();
        const dataWithUpdatedType = this._setTypeInBlob(file);

        if (file.name) {
            formPost.append(opts.fieldName, dataWithUpdatedType, file.name);
            formPost.append('name', file.name);
        } else {
            formPost.append(opts.fieldName, dataWithUpdatedType);
        }
        
        if (file.type) {
            formPost.append('type', file.type);
        }
        
        return formPost;
    }

    _setTypeInBlob(file) {
        const dataWithUpdatedType = file.slice(0, file.size, file.type);
        return dataWithUpdatedType;
    }
    
    
    _getLink(links) {
        let str = '';

        if (!this._isEmptyObject(links)) {
            let keys = Object.keys(links);

            if (keys.length === 1) {
                str = links['fallback'];
            } else {
                for (let i in links) {
                    if (i !== 'fallback') {
                        return links[i];
                        break;
                    }
                }
            }
        }

        return str;
    }
    
    _isEmptyObject(obj) {
        for (let i in obj) {
            if (obj.hasOwnProperty(i)) {
                return false;
            }
        }
        return true;
    }
}

/**
 * The configuration of the {@link module:upload/adapters/simpleuploadadapter~SimpleUploadAdapter simple upload adapter}.
 *
 *        ClassicEditor
 *            .create( editorElement, {
 *				simpleUpload: {
 *					// The URL the images are uploaded to.
 *					uploadUrl: 'http://example.com',
 *
 *					// Headers sent along with the XMLHttpRequest to the upload server.
 *					headers: {
 *						...
 *					}
 *				}
 *			} );
 *            .then( ... )
 *            .catch( ... );
 *
 * See the {@glink features/image-upload/simple-upload-adapter "Simple upload adapter"} guide to learn more.
 *
 * See {@link module:core/editor/editorconfig~EditorConfig all editor configuration options}.
 *
 * @interface SimpleUploadConfig
 */