/**
 * Time Stamp.
 *
 * Ensure the time stamp UID is set for all blocks.
 */

/**
 * Third Party Imports.
 *
 * - _isEmpty
 *   Lodash is empty checks if something is truly empty.
 *   @see https://lodash.com/docs/4.17.15#isEmpty
 */
import _isEmpty from 'lodash/isEmpty';

// If the uid is not set, set the uid.
export default ( props ) => {
	const { uid } = props;
	if ( _isEmpty( uid ) ) {
		return {
			...props,
			uid: new Date().valueOf().toString(),
		};
	}
	return props;
};
