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
import { dispatch, select } from '@wordpress/data';
import { Fragment } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import settings from '../../../settings';
import { sidebarName as sidebarCommentsName } from '../../sidebar-comments/components/Sidebar';

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
		const currentUserId = select( 'core' ).getCurrentUser().id;
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
								if ( ! blockComments.find( ( item ) => item.uid === parseInt( uid, 10 ) ) ) {
									editPost( {
										...postMeta,
										meta: {
											[ metaKeyBlockComments ]: [
												...blockComments,
												{
													authorID: parseInt( currentUserId, 10 ),
													comment: '',
													dateTime: parseInt( new Date().valueOf(), 10 ),
													parent: 0,
													uid: parseInt( uid, 10 ),
												},
											],
										},
									} );
								}
								dispatch( 'core/edit-post' )
									.openGeneralSidebar( `${ sidebarCommentsName }/${ sidebarCommentsName }` );

								setTimeout( () => {
									document.querySelector( `[data-block-comment='${ uid }']` )
										.focus();
									document.querySelector( `[data-block-comment='${ uid }']` )
										.scrollIntoView( { behavior: 'smooth', block: 'center', inline: 'nearest' } );
									const inputControl = document.querySelector( `[data-block-comment='${ uid }'] textarea` );
									if ( inputControl ) {
										inputControl.focus();
										inputControl.setSelectionRange( inputControl.value.length, inputControl.value.length );
									}
								},
								200 );
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
		postMeta: PropTypes.objectOf( PropTypes.any ).isRequired,
	};

	// Return the Higher-Order Component.
	return withBlockControls;
}, 'withBlockControls' );
