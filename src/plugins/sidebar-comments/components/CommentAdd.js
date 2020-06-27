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
import { Component, Fragment } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Plugin Imports.
 */
import settings from '../../../settings';
// eslint-disable-next-line import/no-cycle
import { sidebarName } from './Sidebar';

/**
 * Register Component
 *
 * Component that registers a toolbar that adds or selects a comment.
 */
class CommentAdd extends Component {
	render() {
		const {
			editPost,
			postMeta,
			uid,
		} = this.props;

		const { metaKeyBlockComments } = settings;
		const blockComments = postMeta[ metaKeyBlockComments ];
		const currentUserId = select( 'core' ).getCurrentUser().id;
		return (
			<Button
				className={ `${ sidebarName }__comment-add comment comment--add` }
				data-block-comment={ uid }
				icon="plus"
				label={ __( 'Add Comment', 'wholesome-publishing' ) }
				onClick={ () => {
					if ( ! blockComments.find( ( item ) => item.uid === uid ) ) {
						editPost( {
							...postMeta,
							meta: {
								[ metaKeyBlockComments ]: [
									...blockComments,
									{
										authorID: currentUserId.toString(),
										comment: '',
										dateTime: new Date().valueOf().toString(),
										parent: '0',
										uid,
									},
								],
							},
						} );
					}
					// Open the sidebar.
					dispatch( 'core/edit-post' )
						.openGeneralSidebar( `${ sidebarName }/${ sidebarName }` );

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
		);
	}
}

// Export the CommentAdd Component.
export default CommentAdd;
