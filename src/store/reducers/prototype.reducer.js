const defaultState = {
    loading: false,
    result: [],
    error: null
}

/* Generic Reducer Model */
export function ReducerPrototype(
    LAUNCH_TYPE,
    SUCCESS_TYPE,
    FAILURE_TYPE,
    initialState=defaultState,
    successCallback=fn=>fn&&fn(),
    failureCallback=fn=>fn&&fn()
) {
    return (state=initialState, { type, payload, callback }) => {
        const newState = { ...state };
        switch (type) {
            default: break;
            case LAUNCH_TYPE:
                newState.loading = true;
                break;
            case SUCCESS_TYPE:
                successCallback(callback);
                newState.loading = false;
                newState.error = null;
                newState.result = payload;
                break;
            case FAILURE_TYPE:
                failureCallback(callback);
                newState.loading = false;
                newState.error = payload;
                newState.result = null;
                break;
        }
        return newState;
    }
}