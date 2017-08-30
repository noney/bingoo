import state from './com-name-state';
import pre from './com-name-mutation-types';

/**
 * [getters description]
 * @type {Object}
 */
const getters = {
	
};
//state for getters
let keys = Object.keys(state);
if (keys) {
	for(let v of keys) {
		getters[`get_${pre}_${v}`] = function(state) {
			return state[v];
		}	
	}
}

export default getters;