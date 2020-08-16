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
use const WholesomeCode\WholesomePublishing\ROOT_DIR;
use const WholesomeCode\WholesomePublishing\SidebarComments\META_KEY_BLOCK_COMMENTS;

use const WholesomeCode\WholesomePublishing\EmailNotifications\UserSettings\META_KEY_EMAIL_NOTIFICATION_IS_POST_AUTHOR;
use const WholesomeCode\WholesomePublishing\EmailNotifications\UserSettings\META_KEY_EMAIL_NOTIFICATION_IS_COMMENT_REPLY;
use const WholesomeCode\WholesomePublishing\EmailNotifications\UserSettings\META_KEY_EMAIL_NOTIFICATION_IS_THREAD_REPLY;
use const WholesomeCode\WholesomePublishing\EmailNotifications\UserSettings\META_KEY_EMAIL_NOTIFICATION_IS_POST_CONTRIBUTOR;

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
	// Get all post types.
	$post_types = get_post_types();

	// Register meta for all public post types.
	foreach ( $post_types as $post_type ) {
		add_action( 'rest_after_insert_' . $post_type, __NAMESPACE__ . '\\handle_emails', 10, 3 );
	}

	/**
	 * User Settings.
	 *
	 * User Settings for Email Notifications.
	 */
	require_once ROOT_DIR . '/inc/email-notifications/user-settings.php';
	UserSettings\setup();
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

		// Don't send emails for empty comments.
		if ( empty( trim( $comment['comment'] ) ) ) {
			continue;
		}

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
					esc_html__( '[username] has commented on your post.', 'wholesome-publishing' ),
					$comments_new,
					'author'
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
					esc_html__( '[username] has replied to your comment.', 'wholesome-publishing' ),
					$comments_new,
					'comment'
				);
			}

			// Email comment parent author.
			$key            = array_search( $comment['parent'], array_column( $comments, 'dateTime' ), true );
			$comment_parent = $comments[ $key ];

			// Ensure comment author is not original comment author, and is not the parent author (already mailed, or it is them)
			if ( $comment_parent['authorID'] !== $comment['authorID'] && (int) $comment_parent['authorID'] !== (int) $post->post_author ) {
				// Email parent comment author: username has replied to your comment.
				send_email(
					$post->ID,
					$comment_parent['authorID'],
					$comment['authorID'],
					esc_html__( '[username] has replied to your comment.', 'wholesome-publishing' ),
					$comments_new,
					'comment'
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
					esc_html__( '[username] has replied to a comment.', 'wholesome-publishing' ),
					$comments_new,
					'thread'
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
					esc_html__( '[username] has commented on a post.', 'wholesome-publishing' ),
					$comments_new,
					'contributor'
				);
			}
		}
	}

	update_post_meta( $post->ID, META_KEY_BLOCK_COMMENTS_PREVIOUS, $comments );
}

function send_email( $post_id, $recipient_id, $commenter_id, $message, $comments, $message_type ) {

	$commenter_user = get_userdata( $commenter_id );
	$recipient_user = get_userdata( $recipient_id );

	if ( ! $post_id || ! $recipient_user || ! $commenter_user ) {
		return;
	}

	if ( (int) $recipient_id === (int) $commenter_id ) {
		return false;
	}

	$do_post_author_notification      = get_user_meta( $recipient_id, META_KEY_EMAIL_NOTIFICATION_IS_POST_AUTHOR, true );
	$do_comment_reply_notification    = get_user_meta( $recipient_id, META_KEY_EMAIL_NOTIFICATION_IS_COMMENT_REPLY, true );
	$do_thread_reply_notification     = get_user_meta( $recipient_id, META_KEY_EMAIL_NOTIFICATION_IS_THREAD_REPLY, true );
	$do_post_contributor_notification = get_user_meta( $recipient_id, META_KEY_EMAIL_NOTIFICATION_IS_POST_CONTRIBUTOR, true );

	$do_post_author_notification      = 'false' !== $do_post_author_notification;
	$do_comment_reply_notification    = 'false' !== $do_comment_reply_notification;
	$do_thread_reply_notification     = 'false' !== $do_thread_reply_notification;
	$do_post_contributor_notification = 'false' !== $do_post_contributor_notification;

	if ( 'author' === $message_type && ! $do_post_author_notification ) {
		return false;
	}

	if ( 'comment' === $message_type && ! $do_comment_reply_notification ) {
		return false;
	}

	if ( 'thread' === $message_type && ! $do_thread_reply_notification ) {
		return false;
	}

	if ( 'contributor' === $message_type && ! $do_post_contributor_notification ) {
		return false;
	}

	$commenter_username   = '';
	$commenter_first_name = get_user_meta( $commenter_id, 'first_name', true );
	$commenter_last_name  = get_user_meta( $commenter_id, 'last_name', true );
	$commenter_username   = $commenter_first_name . ' ' . $commenter_last_name;
	$recipient_email      = $recipient_user->user_email;

	if ( empty( trim( $commenter_username ) ) ) {
		$commenter_username = $commenter_user->data->display_name;
	}

	$edit_post_url = get_edit_post_link( $post_id );

	$message = str_replace( '[username]', esc_html( $commenter_username ), $message );

	$body = '<p>' . esc_html( $message ) . '</p>';

	foreach ( $comments as $comment ) {
		// Don't list empty comments.
		if ( empty( $comment['comment'] ) ) {
			continue;
		}

		$uid              = 0 === (int) $comment['parent'] ? $comment['uid'] : $comment['dateTime'];
		$edit_comment_url = add_query_arg( 'comment_id', $uid, $edit_post_url );

		$body .= '<blockquote>';
		$body .= esc_html( $comment['comment'] );
		$body .= '</blockquote>';
	}

	$body .= '<p>';
	$body .= esc_html__( 'Actions', 'wholesome-publishing' );
	$body .= '</p>';

	$body .= '<ul>';
	$body .= '<li>';
	$body .= '<a href="' . $edit_post_url . '">';
	$body .= esc_html__( 'Edit Post', 'wholesome-publishing' );
	$body .= '</a>';
	$body .= '</li>';
	$body .= '<li>';
	$body .= '<a href="' . get_preview_post_link( $post_id ) . '">';
	$body .= esc_html__( 'View Post', 'wholesome-publishing' );
	$body .= '</a>';
	$body .= '</li>';
	$body .= '</ul>';

	$body .= '<p>';
	$body .= esc_html__( 'To opt out of these emails ', 'wholesome-publishing' );
	$body .= '<a href="' . get_edit_profile_url( $recipient_id ) . '#wholesome-publishing-email-settings">';
	$body .= esc_html__( 'alter your email preferences', 'wholesome-publishing' );
	$body .= '</a>.';
	$body .= '</p>';

	$to      = sanitize_email( $recipient_email );
	$subject = esc_html( $message );
	$headers = [ 'Content-Type: text/html; charset=UTF-8' ];

	wp_mail(
		$to,
		$subject,
		$body,
		$headers
	);
}
