/**
 * React Imports.
 */
import PropTypes from 'prop-types';

/**
 * Third Party Imports.
 */
import _get from 'lodash/get';

/**
 * WordPress Imports.
 */
import { createHigherOrderComponent } from '@wordpress/compose';
import { Component } from '@wordpress/element';

/**
 * Plugin Imports.
 */
import { selectBlockComment } from '../../../utils/commentHighlighting';

class CommentSelectorsContainer extends Component {
	componentDidUpdate() {
		const {
			children,
		} = this.props;

		const isSelected = Boolean( _get( children, 'props.isSelected', false ) );
		const uid = _get( children, 'props.attributes.uid', '' );

		if ( isSelected && uid ) {
			selectBlockComment( uid );
		}
	}

	render() {
		const { children } = this.props;
		return children;
	}
}

CommentSelectorsContainer.propTypes = {
	children: PropTypes.node,
};

CommentSelectorsContainer.defaultProps = {
	children: null,
};

/**
 * Return a higher-order component providing controls for all sidebars.
 */
export default createHigherOrderComponent( ( BlockEdit ) => {
	const withCommentSelectors = ( props ) => {
		return (
			<CommentSelectorsContainer>
				<BlockEdit { ...props } />
			</CommentSelectorsContainer>
		);
	};

	withCommentSelectors.propTypes = {
		children: PropTypes.node,
	};

	withCommentSelectors.defaultProps = {
		children: null,
	};

	return withCommentSelectors;
}, 'withCommentSelectors' );
