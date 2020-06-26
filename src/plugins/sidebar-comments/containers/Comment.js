/**
 * WordPress Imports.
 */
import { compose } from '@wordpress/compose';
import { withSelect } from '@wordpress/data';

/**
 * Plugin Imports.
 */
// eslint-disable-next-line import/no-cycle
import Comment from '../components/Comment';
// eslint-disable-next-line no-unused-vars
import data from '../data';
import withPostMeta from '../../../components/higher-order/withPostMeta';

const mapAuthorToProps = ( select, props ) => {
	const { authorID } = props;
	const authorDetails = select( 'wholesome-code/wholesome-publishing/data' ).getAuthorDetails( authorID );
	if ( ! authorDetails[ authorID ] ) {
		return {};
	}
	const { avatarUrl, userName } = authorDetails[ authorID ];
	return {
		avatarUrl,
		userName,
	};
};

// Add post meta to comment.
export default compose(
	withSelect( mapAuthorToProps ),
	withPostMeta,
)( Comment );
