import { ReducerPrototype } from "./prototype.reducer";

export const MAKE_REQUEST_LAUNCH = 'MAKE_REQUEST_LAUNCH',
    MAKE_REQUEST_SUCCESS = 'MAKE_REQUEST_SUCCESS',
    MAKE_REQUEST_FAILURE = 'MAKE_REQUEST_FAILURE';

export default ReducerPrototype(MAKE_REQUEST_LAUNCH, MAKE_REQUEST_SUCCESS, MAKE_REQUEST_FAILURE, undefined, callback => setTimeout(callback, 50))