/**
 * WordPress Imports.
 */
import { select } from '@wordpress/data';

/**
 * Plugin Imports.
 */
// eslint-disable-next-line import/no-cycle
import { sidebarName } from '../plugins/sidebar-comments/components/Sidebar';

/**
 * Highlight Comment.
 */
export function selectBlockComment( uid ) {
	if ( ! select( 'core/edit-post' ).getActiveGeneralSidebarName() === `${ sidebarName }/${ sidebarName }` ) {
		return;
	}

	unhighlightBlockComments();

	const comment = document.querySelector( `[data-block-comment='${ uid }']` );

	if ( ! comment ) {
		highlightBlockComment();
		return;
	}

	comment.scrollIntoView( { behavior: 'smooth', block: 'center', inline: 'nearest' } );
	comment.classList.add( 'comment__selected' );

	highlightBlockComment();
}

/**
 * Reset Highlighted Comments
 */
export function unhighlightBlockComments() {
	if ( ! select( 'core/edit-post' ).getActiveGeneralSidebarName() === `${ sidebarName }/${ sidebarName }` ) {
		return;
	}
	const commentWrappers = document
		.querySelectorAll( '.wholesome-publishing-comments__panel .comment:not(.comment--child)' );
	commentWrappers.forEach( ( item ) => {
		item.style.opacity = null;
		item.classList.remove( 'comment__selected' );
		if ( item.classList.contains( 'comment--add' ) ) {
			item.style.display = null;
		}
	} );
}

/**
 * Highlight Comment
 */
export function highlightBlockComment() {
	if ( ! select( 'core/edit-post' ).getActiveGeneralSidebarName() === `${ sidebarName }/${ sidebarName }` ) {
		return;
	}

	const commentWrappers = document
		.querySelectorAll( '.wholesome-publishing-comments__panel .comment:not(.comment--child)' );
	commentWrappers.forEach( ( item ) => {
		item.style.opacity = '0.4';

		if ( item.classList.contains( 'comment--add' ) ) {
			item.style.display = null;
		}

		if (
			item.classList.contains( 'comment__selected' )
            || item.querySelector( '.comment__selected' )
		) {
			item.style.opacity = null;

			if ( item.classList.contains( 'comment--add' ) ) {
				item.style.display = 'block';
				item.scrollIntoView( { behavior: 'smooth', block: 'center', inline: 'nearest' } );
			}
		}
	} );
}
