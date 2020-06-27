/**
 * Third Party Imports.
 */
import _isEmpty from 'lodash/isEmpty';
import TextareaAutosize from 'react-autosize-textarea';

/**
 * WordPress Imports.
 */
import PropTypes from 'prop-types';
import { Button } from '@wordpress/components';
import { dispatch, select } from '@wordpress/data';
import { Component } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Plugin Imports.
 */
import settings from '../../../settings';
// eslint-disable-next-line import/no-cycle
import { sidebarName } from './Sidebar';
import { timeSince } from '../../../utils/timeSince';
// eslint-disable-next-line import/no-cycle
import { highlightBlockComment } from '../../../utils/commentHighlighting';

class Comment extends Component {
	constructor( props ) {
		super( props );

		const { dateTime, postMeta } = this.props;
		const { metaKeyBlockComments } = settings;
		const blockComments = postMeta[ metaKeyBlockComments ];

		if ( ! blockComments ) {
			return;
		}

		const blockComment = blockComments.filter( ( item ) => item.dateTime === dateTime )[ 0 ];

		this.state = {
			isSelected: false,
			comment: blockComment.comment,
		};

		this.handleBlur = this.handleBlur.bind( this );
		this.handleFocus = this.handleFocus.bind( this );
	}

	handleBlur( e ) {
		e.preventDefault();
		const { currentTarget } = e;

		setTimeout( () => {
			const { parent } = this.props;
			const isParent = parent === '0';
			const isChildSelected = ( ! _isEmpty( document.activeElement )
				&& document.activeElement.classList.contains( 'comment--child' ) )
				|| ( ! _isEmpty( document.activeElement.closest( '.comment' ) )
				&& document.activeElement.closest( '.comment' ).classList.contains( 'comment--child' ) );

			if ( isParent && isChildSelected ) {
				this.setState( () => ( {
					isSelected: false,
				} ) );
			}

			if ( currentTarget.contains( document.activeElement ) ) {
				return;
			}

			if ( document.activeElement.tagName === 'BODY' ) {
				return;
			}

			this.setState( () => ( {
				isSelected: false,
			} ) );
		}, 50 );
	}

	handleFocus( e ) {
		e.preventDefault();
		e.stopPropagation();

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
					highlightBlockComment();
				}, 50 );
			}

			this.setState( () => ( {
				isSelected: true,
			} ) );
		}
	}

	render() {
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

		const { comment: commentState, isSelected } = this.state;
		const isParent = parent === '0';

		const childClass = ! isParent ? 'comment--child' : '';
		const selectedClass = isSelected ? 'comment__selected' : '';

		const { metaKeyBlockComments, metaKeyBlockCommentsLastUpdated } = settings;
		const blockComments = postMeta[ metaKeyBlockComments ];
		const currentUserId = select( 'core' ).getCurrentUser().id;
		const dateFormatted = timeSince( Number( dateTime ) );

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
					{ isSelected && authorID === currentUserId.toString() ? (
						<TextareaAutosize
							className="comment__comment"
							value={ commentState }
							onChange={ ( e ) => {
								const editedComment = blockComments.filter( ( item ) => item.dateTime === dateTime );

								if ( ! editedComment ) {
									return;
								}

								const editedCommentIndex = blockComments.indexOf( editedComment[ 0 ] );
								blockComments[ editedCommentIndex ].comment = e.target.value;

								this.setState( { comment: e.target.value } );

								editPost( {
									...postMeta,
									meta: {
										[ metaKeyBlockComments ]: blockComments,
										[ metaKeyBlockCommentsLastUpdated ]: new Date().valueOf().toString(),
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
								let updatedComments = blockComments
									.filter( ( item ) => item.dateTime !== dateTime );
								if ( isParent ) {
									updatedComments = blockComments
										.filter( ( item ) => item.dateTime !== dateTime && item.parent !== dateTime );
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
									const newDateTime = new Date().valueOf().toString();
									editPost( {
										...postMeta,
										meta: {
											[ metaKeyBlockComments ]: [
												...blockComments,
												{
													authorID: currentUserId.toString(),
													comment: '',
													dateTime: newDateTime,
													parent: dateTime,
													uid,
												},
											],
										},
									} );
									setTimeout( () => {
										document.querySelector( `[data-block-comment='${ newDateTime }']` )
											.focus();
										document.querySelector( `[data-block-comment='${ newDateTime }']` )
											.scrollIntoView(
												{ behavior: 'smooth', block: 'center', inline: 'nearest' }
											);
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

// Export the Comment.
export default Comment;

// Typechecking the Component props.
Comment.propTypes = {
	authorID: PropTypes.string.isRequired,
	avatarUrl: PropTypes.string,
	blockID: PropTypes.string.isRequired,
	children: PropTypes.shape( {} ),
	comment: PropTypes.string,
	dateTime: PropTypes.string.isRequired,
	editPost: PropTypes.func.isRequired,
	parent: PropTypes.string.isRequired,
	postMeta: PropTypes.objectOf( PropTypes.any ).isRequired,
	uid: PropTypes.string.isRequired,
	userName: PropTypes.string,
};

// Default props.
Comment.defaultProps = {
	avatarUrl: 'https://secure.gravatar.com/avatar/?s=96&d=mm&r=g',
	children: null,
	comment: '',
	userName: '',
};
