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

	// If any user edits the post, log their user ID.
	$current_user_id   = (int) get_current_user_id();
	$post_contributors = (array) get_post_meta( $post->ID, META_KEY_POST_CONTRIBUTORS, true );
	if ( ! in_array( $current_user_id, $post_contributors, true ) ) {
		$post_contributors[] = $current_user_id;
		update_post_meta( $post->ID, META_KEY_POST_CONTRIBUTORS, $post_contributors );
	}

	if ( ! isset( $request['meta'] ) || ! isset( $request['meta'][ META_KEY_BLOCK_COMMENTS ] ) ) {
		return;
	}

	$comments          = (array) $request['meta'][ META_KEY_BLOCK_COMMENTS ];
	$comments_old      = (array) get_post_meta( $post->ID, META_KEY_BLOCK_COMMENTS_PREVIOUS, true );
	$comments_new      = [];
	$contacted_authors = [];

	// Get the new comments.
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

	// When we do the check, we don't want the original author emailing.
	if ( ! in_array( (int) $post->post_author, $contacted_authors, true ) ) {
		$contacted_authors[] = (int) $post->post_author;
	}

	foreach ( $comments_new as $comment ) {

		// When we do the check, we don't want the comment author emailing.
		if ( ! in_array( (int) $comment['authorID'], $contacted_authors, true ) ) {
			$contacted_authors[] = (int) $comment['authorID'];
		}

		// Comment is new, email original author.
		if ( 0 === (int) $comment['parent'] ) {
			// Ensure comment author is not original author.
			if ( (int) $post->post_author !== (int) $comment['authorID'] ) {
				// Email original author: username has left a comment on a post you authored.
				send_email(
					$post->ID,
					$post->post_author,
					$comment['authorID'],
					esc_html_e( '[username] has commented on a post that you authored.', 'wholesome-publishing' ),
					$comments_new
				);
			}
		}

		// Comment is reply.
		if ( 0 !== (int) $comment['parent'] ) {

			// Email original author.
			// Ensure comment author is not original author.
			if ( (int) $post->post_author !== (int) $comment['authorID'] ) {
				// Email original author: username has replied to a comment on a post you authored.
				send_email(
					$post->ID,
					$post->post_author,
					$comment['authorID'],
					esc_html_e( '[username] has replied to a comment that you authored.', 'wholesome-publishing' ),
					$comments_new
				);
			}

			// Email comment parent author.
			$key            = array_search( $comment['parent'], array_column( $comments, 'dateTime' ) );
			$comment_parent = $comments[ $key ];
			// Ensure comment author is not original comment author, and is not the parent author (already mailed, or it is them)
			if ( $comment_parent['authorID'] !== $comment['authorID'] && (int) $comment_parent['authorID'] !== (int) $post->post_author ) {
				// Email parent comment author: username has replied to your comment.
				send_email(
					$post->ID,
					$comment_parent['authorID'],
					$comment['authorID'],
					esc_html_e( '[username] has replied to your comment.', 'wholesome-publishing' ),
					$comments_new
				);
				$contacted_authors[] = (int) $comment_parent['authorID'];
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

				// Comment is by comment author, bail.
				if ( $comment_child['authorID'] === $comment_parent['authorID'] ) {
					continue;
				}

				// User already emailed, bail.
				if ( in_array( $comment_parent['authorID'], $contacted_authors, true ) ) {
					continue;
				}

				// Email thread contributor: username has replied to a comment you have replied to.
				send_email(
					$post->ID,
					$comment_child['authorID'],
					$comment['authorID'],
					esc_html_e( '[username] has replied to a comment that you also replied to.', 'wholesome-publishing' ),
					$comments_new
				);
				$contacted_authors[] = (int) $comment_parent['authorID'];
			}
		}

		// Email post contributors.
		foreach ( $post_contributors as $post_contributor_id ) {
			if ( ! in_array( $post_contributor_id, $contacted_authors, true ) ) {
				// Email post contributor: username has replied to a post you have contributed to.
				send_email(
					$post->ID,
					$post_contributor_id,
					$comment['authorID'],
					esc_html_e( '[username] has commented on a post that you have contributed to.', 'wholesome-publishing' ),
					$comments_new
				);
			}
		}
	}

	update_post_meta( $post->ID, META_KEY_BLOCK_COMMENTS_PREVIOUS, $comments );
}

function send_email( $post_id, $recipient_id, $commenter_id, $message, $comments ) {

	$message = str_replace( '[username]', 'ACTUAL USERNAME', $message );

	$body  = '<p>' . $message . '</p>';
	$body .= ''; // Loop $comments and display as ul/li [username]:[comment] (view). // TODO, query param that will open the comment.
	$body .= ''; // View the comments // TODO, query param that will open the sidebar.
	$body .= ''; // View the post.
	$body .= ''; // To opt out of these emails check your settings. // TODO: email frequency user settings page.

	$to      = // ACTUAL EMAIL ADDRESS ;
	$subject = esc_html( $message );
	$headers = [ 'Content-Type: text/html; charset=UTF-8' ];

	wp_mail( $to, $subject, $body, $headers );
}
