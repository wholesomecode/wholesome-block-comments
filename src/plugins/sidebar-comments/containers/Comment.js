/**
 * WordPress Components.
 */
// eslint-disable-next-line import/no-cycle
import Comment from '../components/Comment';
import withPostMeta from '../../../components/higher-order/withPostMeta';

// Add post meta to comment.
export default withPostMeta( Comment );
