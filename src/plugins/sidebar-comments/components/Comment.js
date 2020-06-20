import PropTypes from 'prop-types';
import { Button } from '@wordpress/components';
import { select } from '@wordpress/data';
import { Component } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import settings from '../../../settings';
// eslint-disable-next-line import/no-cycle
import { sidebarName } from './Sidebar';

class Comment extends Component {
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

		const currentUserId = select( 'core' ).getCurrentUser().id;
		const { metaKeyBlockComments } = settings;
		const blockComments = postMeta[ metaKeyBlockComments ];

		return (
			<div className={ `${ sidebarName }__comment comment` } data-block-comment={ uid }>
				<img alt="" className="comment__avatar" src="" />
				<h2 className="comment__username">{uid}</h2>
				<span className="comment__datatime">{dateTime}</span>
				<div className="comment__text">{ comment }</div>
				<div className="comment__controls">
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
				</div>
			</div>
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
