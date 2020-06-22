/**
 * Sidebar Container.
 *
 * A container for the Sidebar Component, that we use to wrap it with
 * Higher-Order Component(s) HOC.
 */

/**
 * WordPress Imports.
 */
import { compose } from '@wordpress/compose';
import { withSelect } from '@wordpress/data';

/**
 * Plugin Imports.
 */
import withPostMeta from '../../../components/higher-order/withPostMeta';
// Import the component that we are going to wrap.
import Sidebar from '../components/Sidebar';

const mapBlockDetailToProps = ( select ) => {
	const blocks = select( 'core/block-editor' ).getBlocks();
	const blockOrder = blocks.map( ( { attributes } ) => attributes.uid );
	const users = select( 'core' ).getUsers();
	return {
		blocks,
		blockOrder,
		users,
	};
};

export default compose(
	withSelect( mapBlockDetailToProps ),
	withPostMeta,
)( Sidebar );
