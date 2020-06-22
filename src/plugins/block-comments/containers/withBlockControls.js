/**
 * React Imports.
 */
import PropTypes from 'prop-types';

/**
 * WordPress Imports.
 */
import { Button, Toolbar } from '@wordpress/components';
import { BlockControls } from '@wordpress/block-editor';
import { createHigherOrderComponent } from '@wordpress/compose';
import { dispatch, select } from '@wordpress/data';
import { Fragment } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Plugin Imports.
 */
import settings from '../../../settings';
import { sidebarName as sidebarCommentsName } from '../../sidebar-comments/components/Sidebar';

/**
 * Register Component
 *
 * Component that registers a toolbar that adds or selects a comment.
 */
export default createHigherOrderComponent( ( BlockEdit ) => {
	const withBlockControls = ( props ) => {
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
								// Open the sidebar.
								dispatch( 'core/edit-post' )
									.openGeneralSidebar( `${ sidebarCommentsName }/${ sidebarCommentsName }` );

								// Scroll to and focus on comment block.
								setTimeout( () => {
									document.querySelector( `[data-block-comment='${ uid }']` )
										.focus();
									document.querySelector( `[data-block-comment='${ uid }']` )
										.scrollIntoView( { behavior: 'smooth', block: 'center', inline: 'nearest' } );
									const inputControl = document
										.querySelector( `[data-block-comment='${ uid }'] textarea` );
									if ( inputControl ) {
										inputControl.focus();
										inputControl
											.setSelectionRange( inputControl.value.length, inputControl.value.length );
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
