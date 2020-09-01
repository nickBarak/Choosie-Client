import {
	SEARCH_LAUNCH,
	SEARCH_SUCCESS,
	SEARCH_FAILURE,
} from "../reducers/search.reducer";
import { server } from "../../APIs";

export const createSearchLaunch = payload => ({ type: SEARCH_LAUNCH, payload }),
	createSearchSuccess = payload => ({ type: SEARCH_SUCCESS, payload }),
	createSearchFailure = payload => ({ type: SEARCH_FAILURE, payload });

/* Used for /search route results */
export const search = (username, query, page, movies) => {
	return dispatch => {
		dispatch(createSearchLaunch(query));
		fetch(
			server +
				`search?user=${username}&search=${query}&page=${page}${
					movies ? `&movies=${movies}` : ""
				}`
		)
			.then(res => res.json())
			.then(res => {
				dispatch(createSearchSuccess(res));
			})
			.catch(e => dispatch(createSearchFailure(e)));
	};
};
