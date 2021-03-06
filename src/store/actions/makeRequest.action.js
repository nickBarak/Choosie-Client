import {
	MAKE_REQUEST_LAUNCH,
	MAKE_REQUEST_SUCCESS,
	MAKE_REQUEST_FAILURE,
} from "../reducers/makeRequest.reducer";
import { server } from "../../APIs";

export const createMakeRequestLaunch = _ => ({ type: MAKE_REQUEST_LAUNCH }),
	createMakeRequestSuccess = (payload, callback) => ({
		type: MAKE_REQUEST_SUCCESS,
		payload,
		callback,
	}),
	createMakeRequestFailure = payload => ({
		type: MAKE_REQUEST_FAILURE,
		payload,
	});

/* Used generally */
export const makeRequest = (
	route,
	querystring,
	options = {},
	callback = _ => {}
) => {
	return dispatch => {
		dispatch(createMakeRequestLaunch());
		fetch(server + `${route}${querystring ? querystring : ""}`, {
			...options,
			credentials: 'include',
			headers: {
				"Content-Type": "application/json"
			},
		})
			.then(res => res.json())
			.then(res => {
				dispatch(createMakeRequestSuccess(res, callback));
			})
			.catch(e => dispatch(createMakeRequestFailure(e)));
	};
};
