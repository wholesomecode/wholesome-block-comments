/**
 * Inspector Controls.
 *
 * Inspector Controls adds additional controls in the block
 * sidebar, under a custom section.
 */

/**
 * React Imports.
 */
import PropTypes from 'prop-types';

/**
 * WordPress Imports.
 */
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, ToggleControl } from '@wordpress/components';
import { createHigherOrderComponent } from '@wordpress/compose';
import { Fragment }	from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Inspector Controls.
 */
export default createHigherOrderComponent( ( BlockEdit ) => {
	const withInspectorControls = ( props ) => {
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
							help={ __( 'If the block is set to draft it will not show on the front end.',
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
