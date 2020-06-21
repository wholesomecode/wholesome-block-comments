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
			blockOrder,
			postMeta,
		} = this.props;

		// Retrieve the PHP meta key from the settings, and then access the
		// value from the postMeta object.
		const { metaKeyBlockComments, metaKeyExampleToggle } = settings;
		const exampleToggle = postMeta[ metaKeyExampleToggle ];
		const blockComments = postMeta[ metaKeyBlockComments ];

		if ( ! _isEmpty( blockOrder ) ) {
			blockComments.sort( ( a, b ) => {
				const A = a.uid;
				const B = b.uid;

				if ( blockOrder.indexOf( A ) > blockOrder.indexOf( B ) ) {
					return 1;
				}
				return -1;
			} );
		}

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
						<ToggleControl
							checked={ exampleToggle }
							help={ __( 'This toggle updates the post meta value for the example toggle.',
								'wholesome-publishing' ) }
							label={ __( 'Example Toggle Control', 'wholesome-publishing' ) }
							onChange={ ( value ) => {
								// On change use editPost to dispatch the updated
								// postMeta object.
								editPost( {
									...postMeta,
									meta: {
										[ metaKeyExampleToggle ]: value,
									},
								} );
							} }
						/>
						{
							blockComments.map( ( {
								authorID,
								comment,
								dateTime,
								parent,
								uid,
							} ) => {
								return (
									<Comment
										authorID={ authorID }
										comment={ comment }
										dateTime={ dateTime }
										key={ dateTime }
										parent={ parent }
										uid={ uid }
									/>
								);
							} )
						}

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
