export const QUERY_LAUNCH = 'QUERY_LAUNCH',
      QUERY_SUCCESS = 'QUERY_SUCCESS',
      QUERY_FAILURE = 'QUERY_FAILURE';

const initialState = {
    loading: false,
    error: null,
    result: []
}

export default (state=initialState, { type, payload }) => {
    const newState = { ...state };
    switch (type) {
        case QUERY_LAUNCH:
            newState.loading = true;
            break;
        case QUERY_SUCCESS:
            newState.loading = false;
            newState.error = null;
            newState.result = payload;
            break;
        case QUERY_FAILURE:
            newState.loading = false;
            newState.error = payload;
            newState.result = [];
            break;
        default: break;
    }
    return newState;
}