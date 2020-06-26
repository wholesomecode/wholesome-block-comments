/**
 * Block Comments.
 *
 * A plugin to create a toolbar to apply or focus on a block comment.
 */

/**
 * WordPress Imports.
 */
import { compose, createHigherOrderComponent } from '@wordpress/compose';
import { addFilter } from '@wordpress/hooks';

/**
 * Plugin Imports.
 */
import withBlockControls from './containers/withBlockControls';
import withPostMeta from '../../containers/higher-order/withPostMeta';

const withClientIdClassName = createHigherOrderComponent( ( BlockListBlock ) => {
	return ( props ) => {
		const {
			attributes: {
				uid,
			},
			isSelected,
		} = props;

		if ( isSelected ) {
			if ( document.querySelector( '.wholesome-publishing-comments__panel' ) ) {
				const commentWrappersReset = document
					.querySelectorAll( '.wholesome-publishing-comments__panel .comment:not(.comment--child)' );
				commentWrappersReset.forEach( ( item ) => {
					item.style.opacity = '1';
				} );
				const comment = document.querySelector( `[data-block-comment='${ uid }']` );
				console.log( comment );
				comment.scrollIntoView( { behavior: 'smooth', block: 'center', inline: 'nearest' } );
				comment.classList.add( 'comment__selected' );
				// Make all but selected opaque.
				const commentWrappers = document
					.querySelectorAll( '.wholesome-publishing-comments__panel .comment:not(.comment--child)' );
				commentWrappers.forEach( ( item ) => {
					if (
						! item.classList.contains( 'comment__selected' )
				&& ! item.querySelector( '.comment__selected' )
					) {
						item.style.opacity = '0.4';
					}
				} );
			}
		}
		return <BlockListBlock { ...props } />;
	};
}, 'withClientIdClassName' );

wp.hooks.addFilter( 'editor.BlockListBlock', 'my-plugin/with-client-id-class-name', withClientIdClassName );

addFilter(
	'editor.BlockEdit',
	'wholesome-publishing/block-comments-toolbar',
	compose( [
		withPostMeta,
		withBlockControls,
	] ),
	10
);
