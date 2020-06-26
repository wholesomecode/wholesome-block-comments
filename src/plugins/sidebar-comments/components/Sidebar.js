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
			postMeta,
			// users,
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
						<ul>
							{ blockOrder.map( ( uid ) => {
								const currentComments = blockComments
									.filter( ( block ) => block.parent === '0' && block.uid === uid );

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
												key={ dateTime }
												parent={ parent }
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
																		key={ dateTime }
																		parent={ parent }
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
	postMeta: PropTypes.objectOf( PropTypes.any ).isRequired,
	// users: PropTypes.arrayOf( PropTypes.object ),
};

// Default props.
// SidebarComments.defaultProps = {
// 	users: [],
// };
