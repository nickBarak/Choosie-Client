import { server } from '../../APIs';
import { UPDATE_USER_LAUNCH, UPDATE_USER_SUCCESS, UPDATE_USER_FAILURE } from '../reducers/updateUser.reducer';

export const createUpdateUserLaunch = _=> ({ type: UPDATE_USER_LAUNCH }),
             createUpdateUserSuccess = payload => ({ type: UPDATE_USER_SUCCESS, payload }),
             createUpdateUserFailure = payload => ({ type: UPDATE_USER_FAILURE, payload });


export const updateUser = username => {
    return dispatch => {
        if (!username) {
            dispatch( createUpdateUserFailure(null) );
            return;
        }
        dispatch( createUpdateUserLaunch() );
        fetch(server + `users/${username}`)
            .then(res => res.json())
            .then(res => { dispatch( createUpdateUserSuccess(res) ) })
            .catch(e => dispatch( createUpdateUserFailure(e) ));
    }
}