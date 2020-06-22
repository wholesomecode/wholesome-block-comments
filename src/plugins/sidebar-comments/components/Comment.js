import TextareaAutosize from 'react-autosize-textarea';

import PropTypes from 'prop-types';
import { Button } from '@wordpress/components';
import { dispatch, select } from '@wordpress/data';
import { Component } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import settings from '../../../settings';
// eslint-disable-next-line import/no-cycle
import { sidebarName } from './Sidebar';

class Comment extends Component {
	constructor( props ) {
		super( props );
		this.state = { isSelected: false };

		this.handleBlur = this.handleBlur.bind( this );
		this.handleFocus = this.handleFocus.bind( this );
	}

	handleBlur( e ) {
		e.preventDefault();
		const { currentTarget } = e;

		setTimeout( () => {
			const { parent } = this.props;

			if ( currentTarget.contains( document.activeElement ) ) {
				return;
			}

			this.setState( () => ( {
				isSelected: false,
			} ) );
		}, 200 );
	}

	handleFocus( e ) {
		e.preventDefault();
		const { currentTarget } = e;
		const { blockID } = this.props;
		const element = document.getElementById( `block-${ blockID }` );
		const { isSelected } = this.state;
		if ( ! isSelected ) {
			if ( element ) {
				dispatch( 'core/block-editor' ).selectBlock( blockID );

				setTimeout( () => {
					currentTarget.focus();
					const inputControl = currentTarget.querySelector( 'textarea' );
					if ( inputControl ) {
						inputControl.focus();
						inputControl.setSelectionRange( inputControl.value.length, inputControl.value.length );
					}
					element.scrollIntoView( { behavior: 'smooth', block: 'center', inline: 'nearest' } );
				}, 200 );
			}

			this.setState( () => ( {
				isSelected: true,
			} ) );
		}
	}

	render() {
		// Props populated via Higher-Order Component.
		const {
			authorID,
			avatarUrl,
			children,
			comment,
			dateTime,
			editPost,
			parent,
			postMeta,
			uid,
			userName,
		} = this.props;

		const { isSelected } = this.state;
		const isParent = parent === 0;

		const currentUserId = select( 'core' ).getCurrentUser().id;
		const { metaKeyBlockComments } = settings;
		const blockComments = postMeta[ metaKeyBlockComments ];
		const selectedClass = isSelected ? 'comment__selected' : '';
		const childClass = ! isParent ? 'comment--child' : '';

		const date = new Date( dateTime );
		const dateFormatted = `${ date.toISOString().slice( 0, 10 ) } ${ ( `0${ date.getHours() }` ).slice( -2 ) }:${ ( `0${ date.getMinutes() }` ).slice( -2 ) }:${ ( `0${ date.getSeconds() }` ).slice( -2 ) }`;
		return (
			<article
				className={ `${ sidebarName }__comment comment ${ selectedClass } ${ childClass }` }
				data-block-comment={ isParent ? uid : dateTime }
				onBlur={ this.handleBlur }
				onFocus={ this.handleFocus }
				tabIndex="-1"
			>
				<header className="comment__header">
					<img alt={ __( 'Avatar', 'wholesome-publishing' ) } className="comment__avatar" src={ avatarUrl } />
					<div className="comment__meta">
						<h2 className="comment__username">{ userName }</h2>
						<small className="comment__datatime">{ dateFormatted }</small>
					</div>
				</header>
				<div className="comment__body">
					{ isSelected && authorID === currentUserId ? (
						<TextareaAutosize
							className="comment__comment"
							value={ comment }
							onBlur={ () => {
								// TODO: Need to change the array without adding an empty object!
								// Perhaps splice and re add it?
								editPost( {
									...postMeta,
									meta: {
										[ metaKeyBlockComments ]: [ {} ].concat( blockComments ),
									},
								} );
							} }
							onChange={ ( e ) => {
								const editedComment = blockComments.filter( ( item ) => item.dateTime === dateTime );

								if ( ! editedComment ) {
									return;
								}

								const editedCommentIndex = blockComments.indexOf( editedComment[ 0 ] );
								blockComments[ editedCommentIndex ].comment = e.target.value;

								editPost( {
									...postMeta,
									meta: {
										[ metaKeyBlockComments ]: blockComments,
									},
								} );
							} }
						/>
					) : (
						<span className="comment__comment">{ comment }</span>
					)}
				</div>
				{ children }
				{ isSelected && (
					<footer className="comment__controls">
						<Button
							icon="trash"
							label={ __( 'Delete Comment', 'wholesome-publishing' ) }
							onClick={ () => {
								let updatedComments = blockComments.filter( ( item ) => item.dateTime !== dateTime );
								if ( isParent ) {
									updatedComments = blockComments.filter( ( item ) => item.dateTime !== dateTime && item.parent !== dateTime );
								}

								editPost( {
									...postMeta,
									meta: {
										[ metaKeyBlockComments ]: updatedComments,
									},
								} );
							} }
						/>
						{ isParent && (
							<Button
								icon="image-rotate"
								label={ __( 'Reply', 'wholesome-publishing' ) }
								onClick={ () => {
									const newDateTime = parseInt( new Date().valueOf(), 10 );
									editPost( {
										...postMeta,
										meta: {
											[ metaKeyBlockComments ]: [
												...blockComments,
												{
													authorID: parseInt( currentUserId, 10 ),
													comment: '',
													dateTime: newDateTime,
													parent: dateTime,
													uid: parseInt( uid, 10 ),
												},
											],
										},
									} );
									setTimeout( () => {
										document.querySelector( `[data-block-comment='${ newDateTime }']` )
											.focus();
										document.querySelector( `[data-block-comment='${ newDateTime }']` )
											.scrollIntoView( { behavior: 'smooth', block: 'center', inline: 'nearest' } );
										document.querySelector( `[data-block-comment='${ newDateTime }'] textarea` )
											.focus();
									},
									200 );
								} }
							/>
						)}
					</footer>
				) }
			</article>
		);
	}
}

// Export the Sidebar.
export default Comment;

// Typechecking the Component props.
Comment.propTypes = {
	editPost: PropTypes.func.isRequired,
	postMeta: PropTypes.objectOf( PropTypes.any ).isRequired,
};
