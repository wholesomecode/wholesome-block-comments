/**
 * Block Comments.
 *
 * A plugin to create a toolbar to apply or focus on a block comment.
 */

/**
 * WordPress Imports.
 */
import { compose } from '@wordpress/compose';
import { addFilter } from '@wordpress/hooks';

/**
 * Plugin Imports.
 */
import withBlockControls from './containers/withBlockControls';
import withBlockCommentSelector from './containers/withBlockCommentSelector';
import withPostMeta from '../../containers/higher-order/withPostMeta';

addFilter(
	'editor.BlockEdit',
	'wholesome-publishing/block-comments-toolbar',
	compose( [
		withPostMeta,
		withBlockControls,
		withBlockCommentSelector,
	] ),
	10
);
