import { SEARCH_LAUNCH, SEARCH_SUCCESS, SEARCH_FAILURE } from "../reducers/search.reducer";
import { server } from '../../APIs';
import { ActionPrototype } from "./prototype.action";

export const search = ActionPrototype(SEARCH_LAUNCH, SEARCH_SUCCESS, SEARCH_FAILURE, server+`search?user=!{1}!&search=!{2}!&page=!{3}!`)