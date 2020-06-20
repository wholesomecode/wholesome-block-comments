/**
 * Block Comments.
 *
 * A plugin to create a toolbar to implement comments on a block.
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
 */
import withBlockControls from './containers/withBlockControls';
import withPostMeta from '../../components/higher-order/withPostMeta';

addFilter(
	'editor.BlockEdit',
	'wholesome-publishing/block-comments-toolbar',
	compose( [
		withPostMeta,
		withBlockControls,
	] ),
	10
);
