import { server } from '../../APIs';
import { QUERY_LAUNCH, QUERY_SUCCESS, QUERY_FAILURE } from '../reducers/query.reducer';

const createQueryLaunch = _=> ({ type: QUERY_LAUNCH }),
      createQuerySuccess = payload => ({ type: QUERY_SUCCESS, payload }),
      createQueryFailure = payload => ({ type: QUERY_FAILURE, payload });

export const query = () => {
    return dispatch => {
        dispatch( createQueryLaunch() );
        fetch(server + '...')
            .then(res => res.json())
            .then(json => dispatch( createQuerySuccess(json) ))
            .catch(e => dispatch( createQueryFailure(e) ));
    }
}