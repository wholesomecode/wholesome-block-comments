/**
 * React Imports.
 *
 * - PropTypes
 *   Typechecking for React components.
 *   @see https://reactjs.org/docs/typechecking-with-proptypes.html
 */
import PropTypes from 'prop-types';

/**
 * WordPress Imports.
 *
 * - Button
 *   Generates a button.
 *   @see https://developer.wordpress.org/block-editor/components/button/
 *
 * - Toolbar
 *   Group related items with an icon in the toolbar.
 *   @see https://developer.wordpress.org/block-editor/components/toolbar/
 *
 * - BlockControls
 *   Controls for the block that appear in the block toolbar.
 *   @see https://developer.wordpress.org/block-editor/tutorials/block-tutorial/block-controls-toolbar-and-sidebar/
 *
 * - Component
 *   A base class to create WordPress Components (Refs, state and lifecycle hooks).
 *   @see https://developer.wordpress.org/block-editor/packages/packages-element/#Component
 *
 * - __
 *   Internationalization - multilingual translation support.
 *   @see https://developer.wordpress.org/block-editor/developers/internationalization/
 */
import { Button, Toolbar } from '@wordpress/components';
import { BlockControls } from '@wordpress/block-editor';
import { createHigherOrderComponent } from '@wordpress/compose';
import { Fragment } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import settings from '../../../settings';

/**
 * Register Component
 *
 * Component that registers a toolbar with a button to edit the image.
 */
export default createHigherOrderComponent( ( BlockEdit ) => {
	const withBlockControls = ( props ) => {
		// Extract props.
		const {
			attributes: {
				uid,
			},
			editPost,
			postMeta,
		} = props;

		const { metaKeyBlockComments } = settings;
		const blockComments = postMeta[ metaKeyBlockComments ];

		// Add the inspector control, and the original component (BlockEdit).
		return (
			<Fragment>
				<BlockEdit { ...props } />
				<BlockControls>
					<Toolbar>
						<Button
							icon="admin-comments"
							label={ __( 'Block Comments', 'wholesome-publishing' ) }
							onClick={ () => {
								editPost( {
									...postMeta,
									meta: {
										[ metaKeyBlockComments ]: [ {
											// authorID: 0,
											comment: '',
											dateTime: parseInt( new Date().valueOf(), 10 ),
											// parent: 0,
											uid: parseInt( uid, 10 ),
										} ],
									},
								} );
							} }
						/>
					</Toolbar>
				</BlockControls>
			</Fragment>
		);
	};

	// Component Typechecking.
	withBlockControls.propTypes = {
		attributes: PropTypes.shape( {
			uid: PropTypes.string,
		} ).isRequired,
		editPost: PropTypes.func.isRequired,
		postMeta: PropTypes.func.isRequired,
	};

	// Return the Higher-Order Component.
	return withBlockControls;
}, 'withBlockControls' );
