/**
 * Block UID.
 *
 * A plugin to add a unique id (uid) into each block, so that data relating to it can
 * be stored as meta.
 */

/**
 * WordPress Imports.
 *
 * - addFilter
 *   WordPress block editor (Gutenberg) filter hook.
 *   @see https://developer.wordpress.org/block-editor/developers/filters/block-filters/
 */
import { addFilter } from '@wordpress/hooks';

/**
 * Plugin Imports.
 *
 * - attributes
 *   Add additional attributes so that control settings can be saved.
 *
 * - withTimeStamp
 *   Pre-populate the Time Stamp.
 *
 * - uid
 *   Save extra props. Currently has issues.
 */
import attributes from './settings/attributes';
import withTimeStamp from './containers/withTimeStamp';

/**
 * Attributes.
 *
 * Add extra attributes to a block, so that additional
 * controls are able to save their state.
 *
 * @param object settings The existing block settings.
 */
addFilter(
	'blocks.registerBlockType',
	'wholesome-publishing/block-uid-attributes',
	( settings ) => {
		// Restrict block types.
		// if ( settings.name !== 'core/image' ) {
		// 	return settings;
		// }

		return attributes( settings );
	}
);

/**
 * Time Stamp.
 *
 * Ensure the time stamp UID is set for all blocks.
 *
 * Note that if we wanted to add multiple higher order components we
 * could do so with `compose`.
 *
 * @param object settings The existing block settings.
 */
addFilter(
	'editor.BlockEdit',
	'wholesome-publishing/block-uid-generator',
	withTimeStamp
);

/**
 * UID
 *
 * A better way to add props on save, but currently has issues.
 * It will break all the blocks when used.
 * @see https://github.com/WordPress/gutenberg/issues/22386
 */
// addFilter(
// 	'blocks.getSaveContent.extraProps',
// 	'wholesome-publishing/block-uid-generator',
// 	( props, blockType ) => {
// 		// Restrict block types.
// 		if ( blockType.name !== 'core/paragraph' ) {
// 			// return props;
// 		}
// 		return uid( props );
// 	}
// );
