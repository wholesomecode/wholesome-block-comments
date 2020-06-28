/**
 * WordPress Imports.
 */
import { __ } from '@wordpress/i18n';

/**
 * Time Since.
 *
 * Calculate the time since the last update and display in text.
 *
 * @param {Date} date
 */
export function timeSince( date ) {
	const seconds = Math.floor( ( new Date() - new Date( date ) ) / 1000 );

	let interval = Math.floor( seconds / 31536000 );

	if ( interval > 1 ) {
		return `${ interval } ${ __( 'years ago', 'wholesome-publishing' ) }`;
	}
	interval = Math.floor( seconds / 2592000 );
	if ( interval > 1 ) {
		return `${ interval } ${ __( 'months ago', 'wholesome-publishing' ) }`;
	}
	interval = Math.floor( seconds / 86400 );
	if ( interval > 1 ) {
		return `${ interval } ${ __( 'days ago', 'wholesome-publishing' ) }`;
	}
	interval = Math.floor( seconds / 3600 );
	if ( interval > 1 ) {
		return `${ interval } ${ __( 'hours ago', 'wholesome-publishing' ) }`;
	}
	interval = Math.floor( seconds / 60 );
	if ( interval > 1 ) {
		return `${ interval } ${ __( 'minutes ago', 'wholesome-publishing' ) }`;
	}
	return `${ Math.floor( seconds ) } ${ __( 'seconds ago', 'wholesome-publishing' ) }`;
}
