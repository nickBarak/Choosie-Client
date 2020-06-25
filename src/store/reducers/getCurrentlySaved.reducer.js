export const GET_CURRENTLY_SAVED_LAUNCH = 'GET_CURRENTLY_SAVED_LAUNCH',
    GET_CURRENTLY_SAVED_SUCCESS = 'GET_CURRENTLY_SAVED_SUCCESS',
    GET_CURRENTLY_SAVED_FAILURE = 'GET_CURRENTLY_SAVED_FAILURE';

const initialState = {
    loading: false,
    result: [],
    error: null
};

export default (state=initialState, { type, payload }) => {
    switch (type) {
        default: return state;;
        case GET_CURRENTLY_SAVED_LAUNCH:
            return {
                ...state,
                loading: true
            }
        case GET_CURRENTLY_SAVED_SUCCESS:
            return {
                ...state,
                loading: false,
                result: payload,
                error: null
            }
        case GET_CURRENTLY_SAVED_FAILURE:
            return {
                ...state,
                loading: false,
                result: [],
                error: payload
            }
    }
}