/**
 * Sidebar Container.
 *
 * A container for the Sidebar Component, that we use to wrap it with
 * Higher-Order Component(s) HOC.
 */

/**
 * Third Party Imports.
 */
import _isEmpty from 'lodash/isEmpty';

/**
 * WordPress Imports.
 */
import { compose } from '@wordpress/compose';
import { withSelect } from '@wordpress/data';

/**
 * Plugin Imports.
 */
import withPostMeta from '../../../containers/higher-order/withPostMeta';
import Sidebar from '../components/Sidebar';

/**
 * Flatten Blocks.
 *
 * @param {array} blocks Array of blocks.
 * @param {array} flattened A flattened array of blocks.
 */
const flattenBlocks = ( blocks, flattened ) => {
	blocks.forEach( ( block ) => {
		flattened.push( block );
		if ( ! _isEmpty( block.innerBlocks ) ) {
			flattened = flattenBlocks( block.innerBlocks, flattened );
		}
	} );

	return flattened;
};

const mapBlockDetailToProps = ( select ) => {
	const blocks = select( 'core/block-editor' ).getBlocks();
	let flattened = [];
	flattened = flattenBlocks( blocks, flattened );
	const blockOrder = flattened.map( ( { attributes } ) => attributes.uid );
	return {
		blocks: flattened,
		blockOrder,
	};
};

export default compose(
	withSelect( mapBlockDetailToProps ),
	withPostMeta,
)( Sidebar );
