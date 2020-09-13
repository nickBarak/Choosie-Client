import { server } from "../../APIs";
import {
	UPDATE_USER_LAUNCH,
	UPDATE_USER_SUCCESS,
	UPDATE_USER_FAILURE,
} from "../reducers/updateUser.reducer";

export const createUpdateUserLaunch = _ => ({ type: UPDATE_USER_LAUNCH }),
	createUpdateUserSuccess = payload => ({
		type: UPDATE_USER_SUCCESS,
		payload,
	}),
	createUpdateUserFailure = payload => ({
		type: UPDATE_USER_FAILURE,
		payload,
	});

/* Used to refresh current user data */
export const updateUser = username => {
	return dispatch => {
		if (!username) {
			dispatch(createUpdateUserFailure(null));
			fetch(server + `destroy-session`, { credentials: 'include' })
				.catch(e => console.log(e));
			return;
		}
		dispatch(createUpdateUserLaunch());
		fetch(server + `users/${username}`, {
			credentials: 'include'
		})
			.then(res => res.json())
			.then(res => {
				dispatch(createUpdateUserSuccess(res));
			})
			.catch(e => dispatch(createUpdateUserFailure(e)));
	};
};
