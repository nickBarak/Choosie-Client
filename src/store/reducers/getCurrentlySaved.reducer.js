import { ReducerPrototype } from "./prototype.reducer";

export const GET_CURRENTLY_SAVED_LAUNCH = "GET_CURRENTLY_SAVED_LAUNCH",
	GET_CURRENTLY_SAVED_SUCCESS = "GET_CURRENTLY_SAVED_SUCCESS",
	GET_CURRENTLY_SAVED_FAILURE = "GET_CURRENTLY_SAVED_FAILURE";

/* Used for /my-list route */
export default ReducerPrototype(
	GET_CURRENTLY_SAVED_LAUNCH,
	GET_CURRENTLY_SAVED_SUCCESS,
	GET_CURRENTLY_SAVED_FAILURE
);
