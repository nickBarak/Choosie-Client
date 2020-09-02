import {
	SEARCH_TITLE_LAUNCH,
	SEARCH_TITLE_SUCCESS,
	SEARCH_TITLE_FAILURE,

	SEARCH_PEOPLE_LAUNCH,
	SEARCH_PEOPLE_SUCCESS,
	SEARCH_PEOPLE_FAILURE,

	SEARCH_GENRE_LAUNCH,
	SEARCH_GENRE_SUCCESS,
	SEARCH_GENRE_FAILURE,

	SEARCH_DESCRIPTION_LAUNCH,
	SEARCH_DESCRIPTION_SUCCESS,
	SEARCH_DESCRIPTION_FAILURE,

	SEARCH_RELEASE_DATE_LAUNCH,
	SEARCH_RELEASE_DATE_SUCCESS,
	SEARCH_RELEASE_DATE_FAILURE,

	SEARCH_AGE_RATING_LAUNCH,
	SEARCH_AGE_RATING_SUCCESS,
	SEARCH_AGE_RATING_FAILURE,
} from '../reducers/search.reducer';
import { server } from "../../APIs";


/* Used for /search route results */
const searchPrototype = (SEARCH_LAUNCH, SEARCH_SUCCESS, SEARCH_FAILURE, route) => (username, query, page, movies) => {
	const createSearchLaunch = payload => ({ type: SEARCH_LAUNCH, payload }),
		createSearchSuccess = payload => ({ type: SEARCH_SUCCESS, payload }),
		createSearchFailure = payload => ({ type: SEARCH_FAILURE, payload });

	return dispatch => {
		dispatch(createSearchLaunch(query));
		fetch(
			server +
				`search/${route}?user=${username}&search=${query}&page=${page}${
					movies ? `&movies=${movies}` : ""
				}`
		)
			.then(res => res.json())
			.then(res => {
				dispatch(createSearchSuccess(res));
			})
			.catch(e => dispatch(createSearchFailure(e)));
	};
};

export const searchTitle = searchPrototype(SEARCH_TITLE_LAUNCH, SEARCH_TITLE_SUCCESS, SEARCH_TITLE_FAILURE, 'title');
export const searchPeople = searchPrototype(SEARCH_PEOPLE_LAUNCH, SEARCH_PEOPLE_SUCCESS, SEARCH_PEOPLE_FAILURE, 'people');
export const searchGenre = searchPrototype(SEARCH_GENRE_LAUNCH, SEARCH_GENRE_SUCCESS, SEARCH_GENRE_FAILURE, 'genre');
export const searchDescription = searchPrototype(SEARCH_DESCRIPTION_LAUNCH, SEARCH_DESCRIPTION_SUCCESS, SEARCH_DESCRIPTION_FAILURE, 'description');
export const searchReleaseDate = searchPrototype(SEARCH_RELEASE_DATE_LAUNCH, SEARCH_RELEASE_DATE_SUCCESS, SEARCH_RELEASE_DATE_FAILURE, 'release-date');
export const searchAgeRating = searchPrototype(SEARCH_AGE_RATING_LAUNCH, SEARCH_AGE_RATING_SUCCESS, SEARCH_AGE_RATING_FAILURE, 'age-rating');

export default {
	searchTitle,
	searchPeople,
	searchGenre,
	searchDescription,
	searchReleaseDate,
	searchAgeRating
}