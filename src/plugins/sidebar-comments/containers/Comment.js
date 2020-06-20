// Import the component that we are going to wrap.
// eslint-disable-next-line import/no-cycle
import Comment from '../components/Comment';
import withPostMeta from '../../../components/higher-order/withPostMeta';

// Compose the HOC, and apply it to the Sidebar Component, and Export it.
export default withPostMeta( Comment );
