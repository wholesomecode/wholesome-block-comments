<?php
/**
 * User Settings.
 *
 * User Settings for Email Notifications.
 *
 * @package wholesome_code/wholesome_publishing
 */

namespace WholesomeCode\WholesomePublishing\EmailNotifications\UserSettings; // @codingStandardsIgnoreLine

use const WholesomeCode\WholesomePublishing\PLUGIN_PREFIX;

const META_KEY_EMAIL_NOTIFICATION_IS_POST_AUTHOR      = '_' . PLUGIN_PREFIX . '_user_email_notification_is_post_author';
const META_KEY_EMAIL_NOTIFICATION_IS_COMMENT_REPLY    = '_' . PLUGIN_PREFIX . '_user_email_notification_is_comment_reply';
const META_KEY_EMAIL_NOTIFICATION_IS_THREAD_REPLY     = '_' . PLUGIN_PREFIX . '_user_email_notification_is_thread_reply';
const META_KEY_EMAIL_NOTIFICATION_IS_POST_CONTRIBUTOR = '_' . PLUGIN_PREFIX . '_user_email_notification_is_post_contributor';

/**
 * Setup.
 *
 * @return void
 */
function setup() : void {
	// Add fields to edit user screen to store DoB.
	add_action( 'show_user_profile', __NAMESPACE__ . '\\add_user_profile_field' );
	add_action( 'edit_user_profile', __NAMESPACE__ . '\\add_user_profile_field' );

	// Save fields when editing DoB via user profile.
	add_action( 'personal_options_update', __NAMESPACE__ . '\\save_user_profile_field' );
	add_action( 'edit_user_profile_update', __NAMESPACE__ . '\\save_user_profile_field' );
}

/**
 * Add User Profile Field.
 *
 * Add profile fields to the edit user screen.
 *
 * @param object $user The user object.
 * @return void
 */
function add_user_profile_field( $user ) : void {

	$is_post_author      = get_user_meta( $user->ID, META_KEY_EMAIL_NOTIFICATION_IS_POST_AUTHOR, true );
	$is_comment_reply    = get_user_meta( $user->ID, META_KEY_EMAIL_NOTIFICATION_IS_COMMENT_REPLY, true );
	$is_thread_reply     = get_user_meta( $user->ID, META_KEY_EMAIL_NOTIFICATION_IS_THREAD_REPLY, true );
	$is_post_contributor = get_user_meta( $user->ID, META_KEY_EMAIL_NOTIFICATION_IS_POST_CONTRIBUTOR, true );

	$is_post_author      = 'false' !== $is_post_author;
	$is_comment_reply    = 'false' !== $is_comment_reply;
	$is_thread_reply     = 'false' !== $is_thread_reply;
	$is_post_contributor = 'false' !== $is_post_contributor;

	?>
	<div id="wholesome-publishing-email-settings">
		<h3><?php esc_html_e( 'Block Comment Notifications', 'wholesome-publishing' ); ?></h3>
		<table class="form-table">
			<tr>
				<th>
					<label>
						<?php esc_html_e( 'Email Notification Settings', 'wholesome-publishing' ); ?>
					</label>
				</th>
				<td>
					<fieldset>
						<label for="<?php echo esc_attr( META_KEY_EMAIL_NOTIFICATION_IS_POST_AUTHOR ); ?>">
							<input
								<?php checked( $is_post_author ); ?>
								id="<?php echo esc_attr( META_KEY_EMAIL_NOTIFICATION_IS_POST_AUTHOR ); ?>"
								name="<?php echo esc_attr( META_KEY_EMAIL_NOTIFICATION_IS_POST_AUTHOR ); ?>"
								type="checkbox"
								value="true"
							/>
							<?php esc_html_e( 'Receive notifications for comments on posts that you have authored', 'wholesome-publishing' ); ?>
						</label>
						<br/>
						<label for="<?php echo esc_attr( META_KEY_EMAIL_NOTIFICATION_IS_COMMENT_REPLY ); ?>">
							<input
								<?php checked( $is_comment_reply ); ?>
								id="<?php echo esc_attr( META_KEY_EMAIL_NOTIFICATION_IS_COMMENT_REPLY ); ?>"
								name="<?php echo esc_attr( META_KEY_EMAIL_NOTIFICATION_IS_COMMENT_REPLY ); ?>"
								type="checkbox"
								value="true"
							/>
							<?php esc_html_e( 'Receive notifications for replies to your comments', 'wholesome-publishing' ); ?>
						</label>
						<br/>
						<label for="<?php echo esc_attr( META_KEY_EMAIL_NOTIFICATION_IS_THREAD_REPLY ); ?>">
							<input
								<?php checked( $is_thread_reply ); ?>
								id="<?php echo esc_attr( META_KEY_EMAIL_NOTIFICATION_IS_THREAD_REPLY ); ?>"
								name="<?php echo esc_attr( META_KEY_EMAIL_NOTIFICATION_IS_THREAD_REPLY ); ?>"
								type="checkbox"
								value="true"
							/>
							<?php esc_html_e( 'Receive notifications for replies to a comment that you have replied to', 'wholesome-publishing' ); ?>
						</label>
						<br/>
						<label for="<?php echo esc_attr( META_KEY_EMAIL_NOTIFICATION_IS_POST_CONTRIBUTOR ); ?>">
							<input
								<?php checked( $is_post_contributor ); ?>
								id="<?php echo esc_attr( META_KEY_EMAIL_NOTIFICATION_IS_POST_CONTRIBUTOR ); ?>"
								name="<?php echo esc_attr( META_KEY_EMAIL_NOTIFICATION_IS_POST_CONTRIBUTOR ); ?>"
								type="checkbox"
								value="true"
							/>
							<?php esc_html_e( 'Receive notifications for comments on posts you have contributed to', 'wholesome-publishing' ); ?>
						</label>
					</fieldset>
				</td>
			</tr>
		</table>
	</div>
	<?php
}

/**
 * Save User Profile Field.
 *
 * Save user fields when edited.
 *
 * @param int $user_id User ID.
 * @return void
 */
function save_user_profile_field( $user_id ) {

	// If current user is not able to edit user, bail.
	if ( ! current_user_can( 'edit_user', $user_id ) ) {
		return false;
	}

	$is_post_author    = isset( $_POST[ META_KEY_EMAIL_NOTIFICATION_IS_POST_AUTHOR ] ) ? sanitize_text_field( $_POST[ META_KEY_EMAIL_NOTIFICATION_IS_POST_AUTHOR ] ) : ''; // @codingStandardsIgnoreLine
	$is_comment_reply  = isset( $_POST[ META_KEY_EMAIL_NOTIFICATION_IS_COMMENT_REPLY ] ) ? sanitize_text_field( $_POST[ META_KEY_EMAIL_NOTIFICATION_IS_COMMENT_REPLY ] ) : ''; // @codingStandardsIgnoreLine
	$is_thread_reply   = isset( $_POST[ META_KEY_EMAIL_NOTIFICATION_IS_THREAD_REPLY ] ) ? sanitize_text_field( $_POST[ META_KEY_EMAIL_NOTIFICATION_IS_THREAD_REPLY ] ) : ''; // @codingStandardsIgnoreLine
	$is_post_contributor = isset( $_POST[ META_KEY_EMAIL_NOTIFICATION_IS_POST_CONTRIBUTOR ] ) ? sanitize_text_field( $_POST[ META_KEY_EMAIL_NOTIFICATION_IS_POST_CONTRIBUTOR ] ) : ''; // @codingStandardsIgnoreLine

	if ( $is_post_author ) {
		update_user_meta( $user_id, META_KEY_EMAIL_NOTIFICATION_IS_POST_AUTHOR, 'true' );
	} else {
		update_user_meta( $user_id, META_KEY_EMAIL_NOTIFICATION_IS_POST_AUTHOR, 'false' );
	}

	if ( $is_comment_reply ) {
		update_user_meta( $user_id, META_KEY_EMAIL_NOTIFICATION_IS_COMMENT_REPLY, 'true' );
	} else {
		update_user_meta( $user_id, META_KEY_EMAIL_NOTIFICATION_IS_COMMENT_REPLY, 'false' );
	}

	if ( $is_thread_reply ) {
		update_user_meta( $user_id, META_KEY_EMAIL_NOTIFICATION_IS_THREAD_REPLY, 'true' );
	} else {
		update_user_meta( $user_id, META_KEY_EMAIL_NOTIFICATION_IS_THREAD_REPLY, 'false' );
	}

	if ( $is_post_contributor ) {
		update_user_meta( $user_id, META_KEY_EMAIL_NOTIFICATION_IS_POST_CONTRIBUTOR, 'true' );
	} else {
		update_user_meta( $user_id, META_KEY_EMAIL_NOTIFICATION_IS_POST_CONTRIBUTOR, 'false' );
	}
}
