/**
 * WordPress Imports.
 */
import apiFetch from '@wordpress/api-fetch';
import { registerStore } from '@wordpress/data';

/**
 * Selectors
 */
const selectors = {
	getAuthorDetails( state ) {
		const { authorDetails } = state;
		return authorDetails;
	},
};

/**
 * Actions
 */
const actions = {
	setAuthorDetails( authorDetails ) {
		return {
			type: 'SET_AUTHOR_DETAILS',
			authorDetails,
		};
	},
	getAuthorDetails( path ) {
		return {
			type: 'GET_AUTHOR_DETAILS',
			path,
		};
	},
};

/**
 * Resolvers
 */
const resolvers = {
	* getAuthorDetails( authorId ) {
		const authorDetails = yield actions.getAuthorDetails(
			`/wholesome-code/wholesome-publishing/v1/comment-author/${ authorId }/`,
		);
		return actions.setAuthorDetails( { [ authorId ]: authorDetails } );
	},
};

/**
 * Controls
 */
const controls = {
	GET_AUTHOR_DETAILS( action ) {
		return apiFetch( { path: action.path } );
	},
};

/**
 * Reducer
 *
 * @param {object} state
 * @param {string} action
 */
function reducer( state = { authorDetails: {} }, action ) {
	switch ( action.type ) {
		case 'SET_AUTHOR_DETAILS':
			// eslint-disable-next-line no-case-declarations
			const actionAuthorDetails = action.authorDetails;
			return {
				...state,
				authorDetails: {
					...state.authorDetails,
					...actionAuthorDetails,
				},
			};
		default:
			return state;
	}
}

/**
 * Register Store.
 */
const store = registerStore(
	'wholesome-code/wholesome-publishing/data',
	{
		actions,
		controls,
		reducer,
		resolvers,
		selectors,
	}
);

export default store;
