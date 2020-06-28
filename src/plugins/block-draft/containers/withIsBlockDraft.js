/**
 * Is Block Draft.
 *
 * Add container to draft blocks to implement backend UI.
 */

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
export default createHigherOrderComponent( ( BlockListBlock ) => {
	const withIsBlockDraft = ( props ) => {
		const {
			attributes: {
				isBlockDraft,
			},
			isSelected,
		} = props;

		let blockClass = isBlockDraft ? 'draft-block' : '';
		if ( isBlockDraft && isSelected ) {
			blockClass += ' draft-block__selected';
		}
		return <BlockListBlock { ...props } className={ blockClass } />;
	};

	// Component Typechecking.
	withIsBlockDraft.propTypes = {
		attributes: PropTypes.shape( {
			isBlockDraft: PropTypes.bool,
		} ).isRequired,
		isSelected: PropTypes.bool.isRequired,
	};

	// Return the Higher-Order Component.
	return withIsBlockDraft;
}, 'withIsBlockDraft' );
