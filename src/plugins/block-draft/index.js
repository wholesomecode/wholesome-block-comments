/**
 * Block Draft.
 *
 * A plugin to create a custom sidebar that contains permission options.
 */

/**
 * WordPress Imports.
 *
 * - addFilter
 *   WordPress block editor (Gutenberg) filter hook.
 *   @see https://developer.wordpress.org/block-editor/developers/filters/block-filters/
 */
import { compose } from '@wordpress/compose';
import { addFilter } from '@wordpress/hooks';

/**
 * Plugin Imports.
 *
 * - attributes
 *   Add additional attributes so that control settings can be saved.
 *
 * - withInspectorControls
 *   Add a Higher-Order Component (HOC) to provide additional Inspector
 *   Controls within a custom section of the sidebar.
 */
import attributes from './settings/attributes';
import withIsBlockDraft from './containers/withIsBlockDraft';
import withInspectorControls from './containers/withInspectorControls';

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
	'wholesome-publishing/block-draft-attributes',
	( settings ) => {
		// Restrict block types.
		// if ( settings.name !== 'core/image' ) {
		// 	return settings;
		// }

		return attributes( settings );
	}
);

/**
 * Inspector Inspector Controls.
 *
 * Inspector Controls adds additional controls in the block
 * sidebar.
 *
 * @param object settings The existing block settings.
 */
addFilter(
	'editor.BlockEdit',
	'wholesome-publishing/block-draft-inspector',
	compose( [
		withIsBlockDraft,
		withInspectorControls,
	] ),
	0
);
