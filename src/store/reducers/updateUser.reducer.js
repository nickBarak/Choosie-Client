import { ReducerPrototype } from "./prototype.reducer";

export const UPDATE_USER_LAUNCH = "UPDATE_USER_LAUNCH",
	UPDATE_USER_SUCCESS = "UPDATE_USER_SUCCESS",
	UPDATE_USER_FAILURE = "UPDATE_USER_FAILURE";

const initialState = {
	loading: false,
	result: null,
	error: null,
};

/* Used to refresh current user data */
export default ReducerPrototype(
	UPDATE_USER_LAUNCH,
	UPDATE_USER_SUCCESS,
	UPDATE_USER_FAILURE,
	initialState
);
