/**
 * Is Block Draft.
 *
 * Add container to draft blocks to implement backend UI.
 */

/**
 * Third Party Imports.
 *
 * - _isEmpty
 *   Lodash is empty checks if something is truly empty.
 *   @see https://lodash.com/docs/4.17.15#isEmpty
 */
import _isEmpty from 'lodash/isEmpty';

/**
 * React Imports.
 *
 * - PropTypes
 *   Typechecking for React components.
 *   @see https://reactjs.org/docs/typechecking-with-proptypes.html
 */
import PropTypes from 'prop-types';

/**
 * WordPress Imports.
 *
 * - createHigherOrderComponent
 *   Returns the enhanced component augmented with a generated displayName.
 *   @see https://developer.wordpress.org/block-editor/packages/packages-compose/#createHigherOrderComponent
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
	const withIsBlockDraft = ( props ) => {
		// Extract props.
		const {
			attributes: {
				isBlockDraft,
			},
			isSelected,
		} = props;

		if ( isBlockDraft ) {
			const blockClass = isSelected ? 'draft-block__selected' : '';
			return (
				<div className={ `draft-block ${ blockClass }` }>
					<BlockEdit { ...props } />
				</div>
			);
		}

		// Load original component.
		return (
			<BlockEdit { ...props } />
		);
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
