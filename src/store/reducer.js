import { combineReducers } from 'redux';
import makeRequest from './reducers/makeRequest.reducer';
import search from './reducers/search.reducer';

export default combineReducers({ makeRequest, search })