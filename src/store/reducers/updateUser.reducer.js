export const UPDATE_USER_LAUNCH = 'UPDATE_USER_LAUNCH',
             UPDATE_USER_SUCCESS = 'UPDATE_USER_SUCCESS',
             UPDATE_USER_FAILURE = 'UPDATE_USER_FAILURE';

const initialState = {
    loading: false,
    result: null,
    error: null
}

export default (state=initialState, { type, payload }) => {
    const newState = { ...state };
    switch (type) {
        default: break;
        case UPDATE_USER_LAUNCH:
            newState.loading = true;
            break;
        case UPDATE_USER_SUCCESS:
            newState.loading = false;
            newState.error = null;
            newState.result = payload;
            break;
        case UPDATE_USER_FAILURE:
            newState.loading = false;
            newState.error = payload;
            newState.result = null;
            break;
    }
    return newState;
}