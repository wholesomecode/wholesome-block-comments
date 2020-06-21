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
					element.scrollIntoView( { behavior: 'smooth', block: 'end', inline: 'nearest' } );
					currentTarget.focus();
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
			comment,
			dateTime,
			editPost,
			parent,
			postMeta,
			uid,
		} = this.props;

		// console.log( blockID );

		const { isSelected } = this.state;

		const currentUserId = select( 'core' ).getCurrentUser().id;
		const { metaKeyBlockComments } = settings;
		const blockComments = postMeta[ metaKeyBlockComments ];
		const selectedClass = isSelected ? 'comment__selected' : '';

		return (
			<article
				className={ `${ sidebarName }__comment comment ${ selectedClass }` }
				data-block-comment={ uid }
				onBlur={ this.handleBlur }
				onFocus={ this.handleFocus }
				tabIndex="-1"
			>
				<header>
					<img alt="" className="comment__avatar" src="" />
					<h2 className="comment__username">{uid}</h2>
				</header>
				<span className="comment__datatime">{dateTime}</span>
				<div className="comment__text">
					{isSelected ? (
						<textarea
							value={ comment }
						/>
					) : (
						<span>{ comment }</span>
					)}
				</div>
				<footer className="comment__controls">
					<Button
						icon="trash"
						label={ __( 'Delete Comment', 'wholesome-publishing' ) }
						onClick={ () => {
							const updatedComments = blockComments.filter( ( item ) => item.dateTime !== dateTime );

							editPost( {
								...postMeta,
								meta: {
									[ metaKeyBlockComments ]: updatedComments,
								},
							} );
						} }
					/>
				</footer>
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
