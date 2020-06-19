import { SEARCH_LAUNCH, SEARCH_SUCCESS, SEARCH_FAILURE } from "../reducers/search.reducer";
import { server } from '../../APIs';

export const createSearchLaunch = payload => ({ type: SEARCH_LAUNCH, payload }),
    createSearchSuccess = payload => ({ type: SEARCH_SUCCESS, payload }),
    createSearchFailure = payload => ({ type: SEARCH_FAILURE, payload });

export const search = (username, query) => {
    return dispatch => {
        dispatch(createSearchLaunch(query))
        fetch(server+`search?user=${username}&search=${query}`)
            .then(res => res.json())
            .then(res => {
                dispatch( createSearchSuccess(res) );
            })
            .catch(e => dispatch( createSearchFailure(e) ))
    }
}