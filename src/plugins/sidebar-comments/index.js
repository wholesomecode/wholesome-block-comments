/**
 * Sidebar Comments.
 *
 * Custom sidebar that contains example post meta controls.
 */

/**
 * WordPress Imports.
 */
import { registerPlugin } from '@wordpress/plugins';

/**
 * Plugin Imports.
 */
import render from './containers/Sidebar';
import { sidebarName as name } from './components/Sidebar';

/**
 * Sidebar Comments.
 *
 * Note that the icon is a dashicon: https://developer.wordpress.org/resource/dashicons/
 * which drops the `dashicons` prefix when used in this context.
 *
 * An SVG can be used here instead.
 */
const settings = {
	icon: 'admin-comments',
	render,
};

// Register the Plugin.
registerPlugin( name, settings );
