export function createImageTypeRegExp( types ) {
	// Sanitize the MIME type name which may include: "+", "-" or ".".
	const regExpSafeNames = types.map( type => type.replace( '+', '\\+' ) );

	return new RegExp( `^image\\/(${ regExpSafeNames.join( '|' ) })$` );
}

export function fetchLocalImage( image ) {
	return new Promise( ( resolve, reject ) => {
		const imageSrc = image.getAttribute( 'src' );

		// Fetch works asynchronously and so does not block browser UI when processing data.
		fetch( imageSrc )
			.then( resource => resource.blob() )
			.then( blob => {
				const mimeType = getImageMimeType( blob, imageSrc );
				const ext = mimeType.replace( 'image/', '' );
				const filename = `image.${ ext }`;
				const file = new File( [ blob ], filename, { type: mimeType } );

				resolve( file );
			} )
			.catch( reject );
	} );
}


export function isLocalImage( node ) {
	if ( !node.is( 'element', 'img' ) || !node.getAttribute( 'src' ) ) {
		return false;
	}

	return node.getAttribute( 'src' ).match( /^data:image\/\w+;base64,/g ) ||
		node.getAttribute( 'src' ).match( /^blob:/g );
}

function getImageMimeType( blob, src ) {
	if ( blob.type ) {
		return blob.type;
	} else if ( src.match( /data:(image\/\w+);base64/ ) ) {
		return src.match( /data:(image\/\w+);base64/ )[ 1 ].toLowerCase();
	} else {
		// Fallback to 'jpeg' as common extension.
		return 'image/jpeg';
	}
}
