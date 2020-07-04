import { combineReducers } from 'redux';
import makeRequest from './reducers/makeRequest.reducer';
import search from './reducers/search.reducer';
import user from './reducers/updateUser.reducer';
import currentlySaved from './reducers/getCurrentlySaved.reducer';
import query from './reducers/query.reducer';

export default combineReducers({ makeRequest, search, user, currentlySaved, query })