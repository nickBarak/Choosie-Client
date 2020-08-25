import { server } from '../../APIs';
import { QUERY_LAUNCH, QUERY_SUCCESS, QUERY_FAILURE } from '../reducers/query.reducer';
import { ActionPrototype } from './prototype.action';

export const query = ActionPrototype(QUERY_LAUNCH, QUERY_SUCCESS, QUERY_FAILURE, server+`query`)