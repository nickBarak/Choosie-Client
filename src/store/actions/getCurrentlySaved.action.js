import { GET_CURRENTLY_SAVED_LAUNCH, GET_CURRENTLY_SAVED_SUCCESS, GET_CURRENTLY_SAVED_FAILURE } from "../reducers/getCurrentlySaved.reducer";
import { server } from '../../APIs';

export const createGetCurrentlySavedLaunch = _=> ({ type: GET_CURRENTLY_SAVED_LAUNCH }),
    createGetCurrentlySavedSuccess = payload => ({ type: GET_CURRENTLY_SAVED_SUCCESS, payload }),
    createGetCurrentlySavedFailure = payload => ({ type: GET_CURRENTLY_SAVED_FAILURE, payload });

export const getCurrentlySaved = movieIDs => {
    return dispatch => {
        dispatch(createGetCurrentlySavedLaunch())
        fetch(server+`movies/list?movies=${movieIDs}`)
            .then(res => res.json())
            .then(res => {
                dispatch( createGetCurrentlySavedSuccess(res) );
            })
            .catch(e => dispatch( createGetCurrentlySavedFailure(e) ))
    }
}