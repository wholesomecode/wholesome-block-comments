<?php
/**
 * Email Notifications.
 *
 * Email notifications if someone comments on an authors post, or replies to a comment.
 *
 * @package wholesome_code/wholesome_publishing
 */

namespace WholesomeCode\WholesomePublishing\EmailNotifications; // @codingStandardsIgnoreLine

use const WholesomeCode\WholesomePublishing\PLUGIN_PREFIX;
use const WholesomeCode\WholesomePublishing\SidebarComments\META_KEY_BLOCK_COMMENTS;

/**
 * Meta Keys:
 *
 * - Post meta comments previous.
 */
const META_KEY_BLOCK_COMMENTS_PREVIOUS = META_KEY_BLOCK_COMMENTS . '_previous';
const META_KEY_POST_CONTRIBUTORS       = PLUGIN_PREFIX . '_post_contributors';

/**
 * Setup.
 *
 * @return void
 */
function setup() : void {
	// TODO: Replace 'post' with a loop of each post type.
	add_action( 'rest_after_insert_post', __NAMESPACE__ . '\\handle_emails', 10, 3 );
}

function handle_emails( $post, $request, $creating = true ) {

	// Code to save post authors here: META_KEY_POST_CONTRIBUTORS.
	//error_log( get_current_user_id() );

	if ( ! isset( $request['meta'] ) || ! isset( $request['meta'][ META_KEY_BLOCK_COMMENTS ] ) ) {
		return;
	}

	$comments     = (array) $request['meta'][ META_KEY_BLOCK_COMMENTS ];
	$comments_old = (array) get_post_meta( $post->ID, META_KEY_BLOCK_COMMENTS_PREVIOUS, true );
	$comments_new = [];

	if ( count( $comments_old ) < 1 || empty( $comments_old[0] ) ) {
		$comments_new = $comments;
	} else {
		$comments_new = array_udiff(
			$comments,
			$comments_old,
			function( $a, $b ) {
				return $a['dateTime'] - $b['dateTime'];
			}
		);
	}

	foreach ( $comments_new as $comment ) {

		// Comment is new, email original author.
		if ( 0 === (int) $comment['parent'] ) {
			// Ensure comment author is not original author.
			if ( (int) $post->post_author !== (int) $comment['authorID'] ) {
				// Email original author: username has left a comment on a post you authored.
				error_log( $post->post_author . ', ' . $comment['authorID'] . 'has left a comment on a post you authored.' );
			}
		}

		// TODO: Save all post authors using: and notify them "a post you contributed to"
		// get_post_meta( $post->ID, '_edit_last', true ); // THIS DOES NOT WORK, use get_current_user_id();
		// META_KEY_POST_CONTRIBUTORS

		if ( 0 !== (int) $comment['parent'] ) {

			// Email original author.
			// Ensure comment author is not original author.
			if ( (int) $post->post_author !== (int) $comment['authorID'] ) {
				// Email original author: username has replied to a comment on a post you authored.
				error_log( $post->post_author . ', ' . $comment['authorID'] . 'has replied to a comment on a post you authored.' );
			}

			// Email comment author.
			$key            = array_search( $comment['parent'], array_column( $comments, 'dateTime' ) );
			$comment_parent = $comment[ $key ];
			// Ensure comment author is not original comment author.
			if ( $comment_parent['authorID'] !== $comment['authorID'] ) {
				// Email parent comment author: username has replied to your comment.
				error_log( $comment_parent['authorID'] . ', ' . $comment['authorID'] . 'has replied to your comment.' );
			}

			// Email thead commentators.
			foreach ( $comments as $comment_child ) {
				// Not a sub comment, bail.
				if ( 0 !== (int) $comment_child ) {
					continue;
				}

				// Not a sub comment of the parent post, bail.
				if ( $comment_child['parent'] !== $comment_parent['dateTime'] ) {
					continue;
				}

				// Comment is by original author, bail.
				if ( (int) $comment_child['authorID'] === (int) $post->post_author ) {
					continue;
				}

				// Comment is by current author, bail.
				if ( $comment_child['authorID'] === $comment_parent['authorID'] ) {
					continue;
				}

				// Email thread contributor: username has replied to a comment you have replied to.
				error_log( $comment_parent['authorID'] . ', ' . $comment['authorID'] . 'has replied to a comment you have replied to.' );
			}
		}
	}

	update_post_meta( $post->ID, META_KEY_BLOCK_COMMENTS_PREVIOUS, $comments );
}
