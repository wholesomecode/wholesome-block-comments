/**
 * Sidebar Component.
 *
 * The Sidebar Component, some props are inherited from Higher-Order Component(s)
 * HOC. These are contained within their own components folder ../containers.
 *
 * Note that post metadata is used within this component. This is registered via
 * PHP within /inc/sidebar-comments.
 */

/**
 * Third Party Imports.
 *
 * - _isEmpty
 *   Lodash is empty checks if something is truly empty.
 *   @see https://lodash.com/docs/4.17.15#isEmpty
 */
import _isEmpty from 'lodash/isEmpty';

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
 * - PanelBody
 *   The PanelBody creates a collapsible container that can be toggled open or closed.
 *   @see https://developer.wordpress.org/block-editor/components/panel/#panelbody
 *
 * - ToggleControl
 *   ToggleControl is used to generate a toggle user interface.
 *   @see https://developer.wordpress.org/block-editor/components/toggle-control/
 *
 * - PluginSidebar
 *   This slot allows for adding items into the Gutenberg Toolbar. Using
 *   this slot will add an icon to the bar that, when clicked, will open
 *   a sidebar with the content of the items wrapped in the <PluginSidebar />
 *   component.
 *   @see https://developer.wordpress.org/block-editor/developers/slotfills/plugin-sidebar/
 *
 * - PluginSidebarMoreMenuItem
 *   This slot allows the creation of a <PluginSidebar> with a menu item that when
 *   clicked will expand the sidebar to the appropriate Plugin section.
 *   @see https://developer.wordpress.org/block-editor/developers/slotfills/plugin-sidebar-more-menu-item/
 *
 * - Component
 *   A base class to create WordPress Components (Refs, state and lifecycle hooks).
 *   @see https://developer.wordpress.org/block-editor/packages/packages-element/#Component
 *
 * - Fragment
 *   A component which renders its children without any wrapping element.
 *   @see https://developer.wordpress.org/block-editor/packages/packages-element/#Fragment
 *
 * - __
 *   Internationalization - multilingual translation support.
 *   @see https://developer.wordpress.org/block-editor/developers/internationalization/
 */
import { PanelBody, ToggleControl } from '@wordpress/components';
import { select } from '@wordpress/data';
import { PluginSidebar, PluginSidebarMoreMenuItem } from '@wordpress/edit-post';
import { Component, Fragment } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Plugin Imports.
 *
 * - settings
 *   Localized settings from the PHP part of the application.
 *
 * Used here to retrieve the meta key for the Login Required
 * meta field, while at the same time allowing a JS friendly
 * name.
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
 * Basic sidebar that updates a post meta value.
 */
class SidebarComments extends Component {
	render() {
		// Props populated via Higher-Order Component.
		const {
			editPost,
			blocks,
			blockOrder,
			postMeta,
			users,
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
								const currentComments = blockComments.filter( ( block ) => block.parent === 0 && block.uid === uid );

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
									const childComments = blockComments.filter( ( block ) => block.parent === dateTime && block.uid === uid );
									childComments.sort( ( a, b ) => {
										if ( a.dateTime < b.dateTime ) { return -1; }
										if ( a.dateTime > b.dateTime ) { return 1; }
										return 0;
									} );

									const block = blocks.filter( ( { attributes } ) => parseInt( attributes.uid, 10 ) === parseInt( uid, 10 ) );
									let blockID = '';

									if ( ! _isEmpty( block ) ) {
										blockID = block[ 0 ].clientId;
									}

									if ( _isEmpty( users ) ) {
										return null;
									}

									const user = users.filter( ( item ) => item.id === authorID );

									if ( ! user ) {
										return null;
									}

									let userName = `${ user[ 0 ].first_name } ${ user[ 0 ].last_name }`;

									if ( _isEmpty( userName ) ) {
										userName = user[ 0 ].nickname;
									}

									if ( _isEmpty( userName ) ) {
										userName = user[ 0 ].username;
									}

									const avatarUrl = user[ 0 ].avatar_urls[ 96 ];
									const classHasChildren = ! _isEmpty( childComments ) ? 'comment__wrapper--has-children' : '';
									return (
										<li className={ `comment__wrapper ${ classHasChildren }` } key={ dateTime }>
											<Comment
												authorID={ authorID }
												avatarUrl={ avatarUrl }
												blockID={ blockID }
												comment={ comment }
												dateTime={ dateTime }
												key={ dateTime }
												parent={ parent }
												uid={ uid }
												userName={ userName }
											/>
											{ childComments && (
												<ul>
													{ childComments.map( ( {
														authorID,
														comment,
														dateTime,
														parent,
														uid,
													} ) => {
														if ( _isEmpty( users ) ) {
															return null;
														}

														const user = users.filter( ( item ) => item.id === authorID );

														if ( ! user ) {
															return null;
														}

														let userName = `${ user[ 0 ].first_name } ${ user[ 0 ].last_name }`;

														if ( _isEmpty( userName ) ) {
															userName = user[ 0 ].nickname;
														}

														if ( _isEmpty( userName ) ) {
															userName = user[ 0 ].username;
														}

														const avatarUrl = user[ 0 ].avatar_urls[ 96 ];
														return (
															<li key={ dateTime }>
																<Comment
																	authorID={ authorID }
																	avatarUrl={ avatarUrl }
																	blockID={ blockID }
																	comment={ comment }
																	dateTime={ dateTime }
																	key={ dateTime }
																	parent={ parent }
																	uid={ uid }
																	userName={ userName }
																/>
															</li>
														);
													} )}
												</ul>
											)}

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
	editPost: PropTypes.func.isRequired,
	postMeta: PropTypes.objectOf( PropTypes.any ).isRequired,
};
