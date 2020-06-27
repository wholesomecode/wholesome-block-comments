/**
 * Third Party Imports.
 */
import _isEmpty from 'lodash/isEmpty';
import _get from 'lodash/get';

/**
 * React Imports.
 */
import PropTypes from 'prop-types';

/**
 * WordPress Imports.
 */
import { PanelBody } from '@wordpress/components';
import { PluginSidebar, PluginSidebarMoreMenuItem } from '@wordpress/edit-post';
import { Component, Fragment } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Plugin Imports.
 */
import settings from '../../../settings';
// eslint-disable-next-line import/no-cycle
import Comment from '../containers/Comment';
// eslint-disable-next-line import/no-cycle
import CommentAdd from './CommentAdd';

// The name and title of the plugin, so that it can be registered and if
// needed accessed within a filter.
export const sidebarName = 'wholesome-publishing-comments';
export const sidebarTitle = __( 'Comments', 'wholesome-publishing' );

/**
 * Sidebar Comments.
 *
 * Sidebar that holds block comments.
 */
class SidebarComments extends Component {
	render() {
		// Props populated via Higher-Order Component.
		const {
			blocks,
			blockOrder,
			editPost,
			postMeta,
		} = this.props;

		// Retrieve the PHP meta key from the settings, and then access the
		// value from the postMeta object.
		const { metaKeyBlockComments } = settings;
		const blockComments = postMeta[ metaKeyBlockComments ];

		return (
			<Fragment>
				<PluginSidebarMoreMenuItem target={ sidebarName }>
					{ sidebarTitle }
				</PluginSidebarMoreMenuItem>
				<PluginSidebar
					name={ sidebarName }
					title={ sidebarTitle }
				>
					<PanelBody
						className={ `${ sidebarName }__panel` }
						title={ __( 'Comments', 'wholesome-publishing' ) }
					>
						{ _isEmpty( blockComments ) && (
							<p>
								{
									// eslint-disable-next-line max-len
									__( 'There are currently no block comments. Select a block from the editor to get started.',
										'wholesome-publishing' )
								}
							</p>
						)}
						<ul>
							{ blockOrder.map( ( uid ) => {
								const currentComments = blockComments
									.filter( ( block ) => block.parent === '0' && block.uid === uid );

								if ( _isEmpty( currentComments ) ) {
									return (
										<CommentAdd
											editPost={ editPost }
											key={ uid }
											postMeta={ postMeta }
											uid={ uid }
										/>
									);
								}

								currentComments.sort( ( a, b ) => {
									if ( a.dateTime < b.dateTime ) { return -1; }
									if ( a.dateTime > b.dateTime ) { return 1; }
									return 0;
								} );

								return currentComments.map( ( {
									authorID,
									comment,
									dateTime,
									parent,
									uid,
								} ) => {
									const childComments = blockComments
										.filter( ( block ) => block.parent === dateTime && block.uid === uid );
									childComments.sort( ( a, b ) => {
										if ( a.dateTime < b.dateTime ) { return -1; }
										if ( a.dateTime > b.dateTime ) { return 1; }
										return 0;
									} );

									const block = blocks.filter( ( { attributes } ) => {
										return attributes.uid === uid;
									} );

									const blockID = _get( block, '0.clientId', '' );

									const classHasChildren = ! _isEmpty( childComments )
										? 'comment__wrapper--has-children' : '';
									return (
										<li className={ `comment__wrapper ${ classHasChildren }` } key={ dateTime }>
											<Comment
												authorID={ authorID }
												blockID={ blockID }
												comment={ comment }
												dateTime={ dateTime }
												editPost={ editPost }
												key={ dateTime }
												parent={ parent }
												postMeta={ postMeta }
												uid={ uid }
											>
												{ childComments && (
													<ul>
														{ childComments.map( ( {
															authorID,
															comment,
															dateTime,
															parent,
															uid,
														} ) => {
															return (
																<li key={ dateTime }>
																	<Comment
																		authorID={ authorID }
																		blockID={ blockID }
																		comment={ comment }
																		dateTime={ dateTime }
																		editPost={ editPost }
																		key={ dateTime }
																		parent={ parent }
																		postMeta={ postMeta }
																		uid={ uid }
																	/>
																</li>
															);
														} )}
													</ul>
												)}
											</Comment>
										</li>
									);
								} );
							} ) }
						</ul>
					</PanelBody>
				</PluginSidebar>
			</Fragment>
		);
	}
}

// Export the Sidebar.
export default SidebarComments;

// Typechecking the Component props.
SidebarComments.propTypes = {
	blocks: PropTypes.arrayOf( PropTypes.object ).isRequired,
	blockOrder: PropTypes.arrayOf( PropTypes.string ).isRequired,
	editPost: PropTypes.func.isRequired,
	postMeta: PropTypes.objectOf( PropTypes.any ).isRequired,
};
