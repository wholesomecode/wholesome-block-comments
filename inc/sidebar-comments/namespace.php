<?php
/**
 * Sidebar Comments.
 *
 * Load the PHP methods that support the block editor plugin within
 * /src/plugins/sidebar-comments.
 *
 * @package wholesomecode/wholesome_publishing
 */

namespace WholesomeCode\WholesomePublishing\SidebarComments; // @codingStandardsIgnoreLine

use const WholesomeCode\WholesomePublishing\PLUGIN_PREFIX;
use const WholesomeCode\WholesomePublishing\ROOT_DIR;

// The Meta Key for the example toggle meta field.
const META_KEY_BLOCK_COMMENTS = '_' . PLUGIN_PREFIX . '_block_comments';

/**
 * Setup
 *
 * @return void
 */
function setup() : void {
	add_action( 'init', __NAMESPACE__ . '\\register_meta_fields', 10 );
	add_filter( PLUGIN_PREFIX . '_block_settings', __NAMESPACE__ . '\\block_settings' );
}

/**
 * Register Meta Fields.
 *
 * Meta Fields need to be registered to allow access to them via the REST API
 * and subsequently the WordPress block editor.
 *
 * @return void
 */
function register_meta_fields() : void {
	// Get all public post types.
	$post_types = get_post_types(
		[
			'public' => true,
		],
		'names'
	);

	// Register meta for all public post types.
	foreach ( $post_types as $post_type ) {

		register_post_meta(
			$post_type,
			META_KEY_BLOCK_COMMENTS,
			[
				'auth_callback' => function() {
					return current_user_can( 'edit_posts' );
				},
				'show_in_rest'  => [
					'schema' => [
						'type'       => 'object',
						'properties' => [
							'authorID' => [
								'type' => 'number',
							],
							'comment'  => [
								'type' => 'string',
							],
							'dateTime' => [
								'type' => 'number',
							],
							'parent'   => [
								'type' => 'number',
							],
							'uid'      => [
								'type' => 'number',
							],
						],
					],
				],
				'single'        => false,
				'type'          => 'object',
			]
		);
	}
}

/**
 * Block Settings.
 *
 * Pass the meta key into the block settings so that it can be accessed via
 * the settings import via /src/settings.js.
 *
 * @param array $settings Existing block settings.
 * @return array
 */
function block_settings( $settings ) : array {
	$settings['metaKeyBlockComments'] = META_KEY_BLOCK_COMMENTS;

	return $settings;
}
