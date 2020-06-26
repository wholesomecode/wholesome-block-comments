/**
 * Block Draft.
 *
 * A plugin to create a custom sidebar that contains block comments.
 */

/**
 * WordPress Imports.
 */
import { addFilter } from '@wordpress/hooks';

/**
 * Plugin Imports.
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
		return attributes( settings );
	}
);

// InspectorControls adds additional controls to the block sidebar.
addFilter(
	'editor.BlockEdit',
	'wholesome-publishing/block-draft-inspector',
	withInspectorControls,
);

// IsBlockDraft adds the additional attributes to the block.
addFilter(
	'editor.BlockListBlock',
	'wholesome-publishing/block-draft-class',
	withIsBlockDraft
);
