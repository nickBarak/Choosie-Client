import { ReducerPrototype } from "./prototype.reducer";

export const QUERY_LAUNCH = 'QUERY_LAUNCH',
      QUERY_SUCCESS = 'QUERY_SUCCESS',
      QUERY_FAILURE = 'QUERY_FAILURE';

export default ReducerPrototype(QUERY_LAUNCH, QUERY_SUCCESS, QUERY_FAILURE)