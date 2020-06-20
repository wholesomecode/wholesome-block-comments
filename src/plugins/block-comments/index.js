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
import { withDispatch, withSelect } from '@wordpress/data';
import { addFilter } from '@wordpress/hooks';

/**
 * Plugin Imports.
 */
import withBlockControls from './containers/withBlockControls';

/**
 * Map Dispatch to Props.
 *
 * Dispatch an action to trigger a state change.
 *
 * - editPost
 *   Returns an action object used in signalling that attributes of the post
 *   have been edited.
 *   - Used to update the metadata of a post.
 *
 * @param function dispatch Calls a registered data store reducer.
 */
const mapDispatchToProps = ( dispatch ) => {
	const { editPost } = dispatch( 'core/editor' );
	return {
		editPost,
	};
};

/**
 * Map Select to Props.
 *
 * Listen for a state change.
 *
 * - getEditedPostAttribute
 *   Returns a single attribute of the post being edited
 *   - The attribute we are wanting is `meta` to get the current metadata of a post.
 *
 * @param function select Calls a registered data store selector.
 */
const mapSelectToProps = ( select ) => {
	const { getEditedPostAttribute } = select( 'core/editor' );
	return {
		postMeta: getEditedPostAttribute( 'meta' ),
	};
};

addFilter(
	'editor.BlockEdit',
	'wholesome-publishing/block-comments-toolbar',
	compose( [
		withDispatch( mapDispatchToProps ),
		withSelect( mapSelectToProps ),
		withBlockControls,
	] ),
	10
);
