<?php
/**
 * Main plugin file.
 *
 * @package wholesome_code/wholesome_publishing
 */

namespace WholesomeCode\WholesomePublishing; // @codingStandardsIgnoreLine

const OPTION_PLUGIN_VERSION = PLUGIN_PREFIX . '_version';

/**
 * Setup
 *
 * - Register activation.
 * - Load text domain.
 * - Enqueue assets.
 *
 * @return void
 */
function setup() : void {

	// Register activation hook.
	register_activation_hook( ROOT_FILE, __NAMESPACE__ . '\\activate' );

	// After plugin upgrade.
	plugin_updated();

	// Load text domain.
	load_plugin_textdomain( 'wholesome-publishing', false, ROOT_DIR . '\languages' );

	// Enqueue Assets.
	add_action( 'enqueue_block_editor_assets', __NAMESPACE__ . '\\enqueue_block_editor_assets', 10 );

	/**
	 * Load plugin features.
	 *
	 * Load the namespace of each of the plugin features.
	 */

	/**
	 * Block Draft.
	 *
	 * Control rendering of draft blocks.
	 */
	require_once ROOT_DIR . '/inc/block-draft/namespace.php';
	BlockDraft\setup();

	/**
	 * Sidebar Comments.
	 *
	 * Sidebar for Comments.
	 */
	require_once ROOT_DIR . '/inc/sidebar-comments/namespace.php';
	SidebarComments\setup();
}

/**
 * Activate hook.
 *
 * - Flush rewrite rules.
 *
 * @return void
 */
function activate() : void {
	flush_rewrite_rules();
}

/**
 * Plugin Updated.
 *
 * - Flush rewrite rules.
 *
 * @return void
 */
function plugin_updated() : void {
	$plugin_version = get_option( OPTION_PLUGIN_VERSION );
	if ( PLUGIN_VERSION !== $plugin_version ) {
		flush_rewrite_rules();
		update_option( OPTION_PLUGIN_VERSION, PLUGIN_VERSION, true );
	}
}

/**
 * Enqueue Block Editor Assets
 *
 * - block-editor.js: scripts for the block editor.
 * - block-editor.scss: styles for the block editor only.
 * - localize the script with custom settings.
 *
 * @return void
 */
function enqueue_block_editor_assets() : void {

	$block_editor_asset_path = ROOT_DIR . '/build/block-editor.asset.php';

	if ( ! file_exists( $block_editor_asset_path ) ) {
		throw new \Error(
			esc_html__( 'You need to run `npm start` or `npm run build` in the root of the plugin "wholesome-publishing" first.', 'wholesome-publishing' )
		);
	}

	$block_editor_scripts = '/build/block-editor.js';
	$block_editor_styles  = '/build/block-editor.css';
	$script_asset         = include $block_editor_asset_path;

	/**
	 * Settings.
	 *
	 * Settings have a filter so other parts of the plugin can append settings
	 * without the code
	 */
	// Settings has a filter so that other parts of the plugin can append settings.
	$block_settings = apply_filters( PLUGIN_PREFIX . '_block_settings', get_block_settings() );

	wp_enqueue_script(
		PLUGIN_SLUG . '-block-editor',
		plugins_url( $block_editor_scripts, ROOT_FILE ),
		$script_asset['dependencies'],
		$script_asset['version'],
		true
	);

	wp_enqueue_style(
		PLUGIN_SLUG . '-block-editor',
		plugins_url( $block_editor_styles, ROOT_FILE ),
		[],
		filemtime( ROOT_DIR . $block_editor_styles )
	);

	wp_localize_script(
		PLUGIN_SLUG . '-block-editor',
		'WholesomePublishingSettings',
		$block_settings
	);
}

/**
 * Get Block Settings.
 *
 * Returns an array of settings which can be passed into the
 * application.
 *
 * Populate this with settings unique to your application.
 *
 * @return array
 */
function get_block_settings() : array {
	return [
		'ajaxUrl' => esc_url( admin_url( 'admin-ajax.php', 'relative' ) ),
	];
}
