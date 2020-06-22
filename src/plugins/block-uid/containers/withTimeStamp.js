/**
 * Time Stamp.
 *
 * Ensure the time stamp UID is set for all blocks.
 */

/**
 * Third Party Imports.
 */
import _isEmpty from 'lodash/isEmpty';

/**
 * React Imports.
 */
import PropTypes from 'prop-types';

/**
 * WordPress Imports.
 */
import { createHigherOrderComponent } from '@wordpress/compose';

/**
 * Time Stamp.
 *
 * Create a Higher-Order Component to populate attributes.
 *
 * BlockEdit loads in the original block edit function, so this
 * component essentially wraps the original. Hence it is Higher-Order.
 */
export default createHigherOrderComponent( ( BlockEdit ) => {
	const withTimeStamp = ( props ) => {
		const {
			attributes: {
				uid,
			},
			setAttributes,
		} = props;

		if ( _isEmpty( uid ) ) {
			setAttributes( { uid: new Date().valueOf().toString() } );
		}

		// Load original component.
		return (
			<BlockEdit { ...props } />
		);
	};

	// Component Typechecking.
	withTimeStamp.propTypes = {
		attributes: PropTypes.shape( {
			uid: PropTypes.string,
		} ).isRequired,
		setAttributes: PropTypes.func.isRequired,
	};

	// Return the Higher-Order Component.
	return withTimeStamp;
}, 'withTimeStamp' );
