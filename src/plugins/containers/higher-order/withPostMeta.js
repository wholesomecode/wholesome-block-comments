/**
  * WordPress Imports.
  */
import { createHigherOrderComponent, compose } from '@wordpress/compose';
import { withDispatch, withSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

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

/**
  * Register Component
  *
  * Component that applies select and dispatch post meta to components.
  */
export default createHigherOrderComponent( ( OriginalComponent ) => {
	// Return the Higher-Order Component.
	return compose(
		withDispatch( mapDispatchToProps ),
		withSelect( mapSelectToProps ),
	)( OriginalComponent );
}, 'withPostMeta' );
