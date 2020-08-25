import { GET_CURRENTLY_SAVED_LAUNCH, GET_CURRENTLY_SAVED_SUCCESS, GET_CURRENTLY_SAVED_FAILURE } from "../reducers/getCurrentlySaved.reducer";
import { server } from '../../APIs';
import { ActionPrototype } from "./prototype.action";

export const getCurrentlySaved = ActionPrototype(GET_CURRENTLY_SAVED_LAUNCH, GET_CURRENTLY_SAVED_SUCCESS, GET_CURRENTLY_SAVED_FAILURE, server+`movies/list?movies=!{1}!`)