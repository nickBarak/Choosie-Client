export const SEARCH_TITLE_LAUNCH = "SEARCH_TITLE_LAUNCH",
	SEARCH_TITLE_SUCCESS = "SEARCH_TITLE_SUCCESS",
	SEARCH_TITLE_FAILURE = "SEARCH_TITLE_FAILURE",
	
	SEARCH_PEOPLE_LAUNCH = "SEARCH_PEOPLE_LAUNCH",
	SEARCH_PEOPLE_SUCCESS = "SEARCH_PEOPLE_SUCCESS",
	SEARCH_PEOPLE_FAILURE = "SEARCH_PEOPLE_FAILURE",
	
	SEARCH_GENRE_LAUNCH = "SEARCH_GENRE_LAUNCH",
	SEARCH_GENRE_SUCCESS = "SEARCH_GENRE_SUCCESS",
	SEARCH_GENRE_FAILURE = "SEARCH_GENRE_FAILURE",
	
	SEARCH_DESCRIPTION_LAUNCH = "SEARCH_DESCRIPTION_LAUNCH",
	SEARCH_DESCRIPTION_SUCCESS = "SEARCH_DESCRIPTION_SUCCESS",
	SEARCH_DESCRIPTION_FAILURE = "SEARCH_DESCRIPTION_FAILURE",

	SEARCH_RELEASE_DATE_LAUNCH = "SEARCH_RELEASE_DATE_LAUNCH",
	SEARCH_RELEASE_DATE_SUCCESS = "SEARCH_RELEASE_DATE_SUCCESS",
	SEARCH_RELEASE_DATE_FAILURE = "SEARCH_RELEASE_DATE_FAILURE",

	SEARCH_AGE_RATING_LAUNCH = "SEARCH_AGE_RATING_LAUNCH",
	SEARCH_AGE_RATING_SUCCESS = "SEARCH_AGE_RATING_SUCCESS",
	SEARCH_AGE_RATING_FAILURE = "SEARCH_AGE_RATING_FAILURE";

const titleState = {
	loading: false,
	searchValue: null,
	result: [],
	error: null,
};
const peopleState = {
	loading: false,
	searchValue: null,
	result: [],
	error: null,
};
const genreState = {
	loading: false,
	searchValue: null,
	result: [],
	error: null,
};
const descriptionState = {
	loading: false,
	searchValue: null,
	result: [],
	error: null,
};
const releaseDateState = {
	loading: false,
	searchValue: null,
	result: [],
	error: null,
};
const ageRatingState = {
	loading: false,
	searchValue: null,
	result: [],
	error: null,
};

/* Used for /search route results */
const searchReducerPrototype = (SEARCH_LAUNCH, SEARCH_SUCCESS, SEARCH_FAILURE, initialState) => (state = initialState, { type, payload }) => {
	switch (type) {
		default:
			return state;
		case SEARCH_LAUNCH:
			return {
				...state,
				loading: true,
				searchValue: payload,
			};
		case SEARCH_SUCCESS:
			return {
				...state,
				loading: false,
				result: payload,
				error: null,
			};
		case SEARCH_FAILURE:
			return {
				...state,
				loading: false,
				result: [],
				error: payload,
			};
	}
};


export const searchTitle = searchReducerPrototype(SEARCH_TITLE_LAUNCH, SEARCH_TITLE_SUCCESS, SEARCH_TITLE_FAILURE, titleState),
	searchPeople = searchReducerPrototype(SEARCH_PEOPLE_LAUNCH, SEARCH_PEOPLE_SUCCESS, SEARCH_PEOPLE_FAILURE, peopleState),
	searchGenre = searchReducerPrototype(SEARCH_GENRE_LAUNCH, SEARCH_GENRE_SUCCESS, SEARCH_GENRE_FAILURE, genreState),
	searchDescription = searchReducerPrototype(SEARCH_DESCRIPTION_LAUNCH, SEARCH_DESCRIPTION_SUCCESS, SEARCH_DESCRIPTION_FAILURE, descriptionState),
	searchReleaseDate = searchReducerPrototype(SEARCH_DESCRIPTION_LAUNCH, SEARCH_DESCRIPTION_SUCCESS, SEARCH_DESCRIPTION_FAILURE, releaseDateState),
	searchAgeRating = searchReducerPrototype(SEARCH_DESCRIPTION_LAUNCH, SEARCH_DESCRIPTION_SUCCESS, SEARCH_DESCRIPTION_FAILURE, ageRatingState);