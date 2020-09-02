import { combineReducers } from "redux";
import makeRequest from "./reducers/makeRequest.reducer";
import { searchTitle, searchPeople, searchGenre, searchDescription } from "./reducers/search.reducer";
import user from "./reducers/updateUser.reducer";
import currentlySaved from "./reducers/getCurrentlySaved.reducer";

export default combineReducers({
	makeRequest,
	searchTitle,
	searchPeople,
	searchGenre,
	searchDescription,
	user,
	currentlySaved,
});
