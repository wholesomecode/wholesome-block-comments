/**
 * Sidebar Container.
 *
 * A container for the Sidebar Component, that we use to wrap it with
 * Higher-Order Component(s) HOC.
 */

// Import the component that we are going to wrap.
import { compose } from '@wordpress/compose';
import { withSelect } from '@wordpress/data';
import Sidebar from '../components/Sidebar';
import withPostMeta from '../../../components/higher-order/withPostMeta';

const mapBlockDetailToProps = ( select ) => {
	const blocks = select( 'core/block-editor' ).getBlocks();
	const blockOrder = blocks.map( ( { attributes } ) => parseInt( attributes.uid, 10 ) );
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
