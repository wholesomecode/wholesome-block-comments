/**
 * Inspector Controls.
 *
 * Inspector Controls adds additional controls in the block
 * sidebar, under a custom section.
 */

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
 * - InspectorControls
 *   Adds inspector controls into a custom section of the block sidebar.
 *   @see https://developer.wordpress.org/block-editor/packages/packages-block-editor/#InspectorControls
 *
 * - PanelBody
 *   The PanelBody creates a collapsible container that can be toggled open or closed.
 *   @see https://developer.wordpress.org/block-editor/components/panel/#panelbody
 *
 * - ToggleControl
 *   ToggleControl is used to generate a toggle user interface.
 *   @see https://developer.wordpress.org/block-editor/components/toggle-control/
 *
 * - createHigherOrderComponent
 *   Returns the enhanced component augmented with a generated displayName.
 *   @see https://developer.wordpress.org/block-editor/packages/packages-compose/#createHigherOrderComponent
 *
 * - Fragment
 *   A component which renders its children without any wrapping element.
 *   @see https://developer.wordpress.org/block-editor/packages/packages-element/#Fragment
 *
 * - __
 *   Internationalization - multilingual translation support.
 *   @see https://developer.wordpress.org/block-editor/developers/internationalization/
 */
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, ToggleControl } from '@wordpress/components';
import { createHigherOrderComponent } from '@wordpress/compose';
import { Fragment }	from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Inspector Controls.
 *
 * Create a Higher-Order Component to add additional Inspector Controls
 * to the block.
 *
 * BlockEdit loads in the original block edit function, so this
 * component essentially wraps the original. Hence it is Higher-Order.
 */
export default createHigherOrderComponent( ( BlockEdit ) => {
	const withInspectorControls = ( props ) => {
		// Extract props.
		const {
			attributes: {
				isBlockDraft,
			},
			setAttributes,
		} = props;

		// Add the inspector control, and the original component (BlockEdit).
		return (
			<Fragment>
				<BlockEdit { ...props } />
				<InspectorControls>
					<PanelBody
						title={ __( 'Publishing', 'wholesome-publishing' ) }
						initialOpen={ false }
						icon="edit"
					>
						<ToggleControl
							label={ __( 'Set Block as Draft', 'wholesome-publishing' ) }
							checked={ isBlockDraft }
							onChange={ ( isBlockDraft ) => setAttributes( { isBlockDraft } ) }
							help={ __( 'If block is set to draft it will not show on the front end.',
								'wholesome-publishing' ) }
						/>
					</PanelBody>
				</InspectorControls>
			</Fragment>
		);
	};

	// Component Typechecking.
	withInspectorControls.propTypes = {
		attributes: PropTypes.shape( {
			isBlockDraft: PropTypes.bool,
		} ).isRequired,
		setAttributes: PropTypes.func.isRequired,
	};

	// Return the Higher-Order Component.
	return withInspectorControls;
}, 'withInspectorControls' );
