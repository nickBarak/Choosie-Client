export const MAKE_REQUEST_LAUNCH = 'MAKE_REQUEST_LAUNCH',
    MAKE_REQUEST_SUCCESS = 'MAKE_REQUEST_SUCCESS',
    MAKE_REQUEST_FAILURE = 'MAKE_REQUEST_FAILURE';

const initialState = {
    loading: false,
    result: [],
    error: null
};

export default (state=initialState, { type, payload }) => {
    switch (type) {
        default: return state;;
        case MAKE_REQUEST_LAUNCH:
            return {
                ...state,
                loading: true
            }
        case MAKE_REQUEST_SUCCESS:
            return {
                ...state,
                loading: false,
                result: payload,
                error: null
            }
        case MAKE_REQUEST_FAILURE:
            return {
                ...state,
                loading: false,
                result: [],
                error: payload
            }
    }
}