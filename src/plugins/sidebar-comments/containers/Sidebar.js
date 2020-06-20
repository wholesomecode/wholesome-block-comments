/**
 * Sidebar Container.
 *
 * A container for the Sidebar Component, that we use to wrap it with
 * Higher-Order Component(s) HOC.
 */

// Import the component that we are going to wrap.
import Sidebar from '../components/Sidebar';
import withPostMeta from '../../../components/higher-order/withPostMeta';

// Compose the HOC, and apply it to the Sidebar Component, and Export it.
export default withPostMeta( Sidebar );
