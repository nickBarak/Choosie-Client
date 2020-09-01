export const SEARCH_LAUNCH = "SEARCH_LAUNCH",
	SEARCH_SUCCESS = "SEARCH_SUCCESS",
	SEARCH_FAILURE = "SEARCH_FAILURE";

const initialState = {
	loading: false,
	searchValue: null,
	result: [],
	error: null,
};

/* Used for /search route results */
export default (state = initialState, { type, payload }) => {
	switch (type) {
		default:
			return state;
		case SEARCH_LAUNCH:
			return {
				...state,
				loading: true,
				searchValue: payload,
			};
		case SEARCH_SUCCESS:
			return {
				...state,
				loading: false,
				result: payload,
				error: null,
			};
		case SEARCH_FAILURE:
			return {
				...state,
				loading: false,
				result: [],
				error: payload,
			};
	}
};
