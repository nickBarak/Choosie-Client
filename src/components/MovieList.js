import React, { useState, useReducer, useRef } from 'react';
import { Link } from 'react-router-dom';

const ageRatings = ['G', 'PG-13', 'TV-14', 'R/TV-MA', 'NR'],
      durations = ['30min', '1h', '1h 30min', '2h', '2h 30min', '3h'],
      genres = ['Action', 'Comedy', 'Drama', 'Thriller'],
      saveDates = ['2 days ago', '1 week ago', '2 weeks ago', '3 weeks ago', '1 month ago', '2 months ago', '3 months ago', '6 months ago', '1 year ago'],
      releaseDates = ['1920', '1930', '1940', '1950', '1960', '1970', '1980', '1990', '2000', '2010', '2020'];

function MovieList({ movies, heading }) {
    const [showDescription, setShowDescription] = useState(false);
    const [displayList, dispatchDisplayList] = useReducer(displayListReducer, movies);
    const [filterOptions, dispatchFilterOptions] = useReducer(filterOptionsReducer, [ [ ...genres ] ]);
    const [selectID, setSelectID] = useState(0);
    
    const [filters, setFilters] = useState([
        <>
            <select onChange={e => dispatchFilterOptions({ type: e.target.options[e.target.selectedIndex].text, payload: selectID })}>
                <option key={0}>Age Rating</option>
                <option key={1}>Duration</option>
                <option key={2}>Genre</option>
                <option key={3}>Date Saved</option>
                <option key={4}>Release Date</option>
            </select>
            <select>
                {(_=> { console.log(filterOptions, selectID); return filterOptions[selectID].map((option, i) => <option key={i}>{option}</option>) })()}
            </select>
            <label><input type="radio" name="filterByRadio" value="higher" />higher/later</label>
            <label><input type="radio" name="filterByRadio" value="lower" />lower/earlier</label>
        </>
    ]);

    function filterOptionsReducer(state=[], { type, payload }) {
        const newState = [ ...state ];
        switch (type) {
            default: return state;
            case 'Age Rating':
                newState[payload].splice(0, state.length, ...ageRatings);
                break;
            case 'Duration':
                newState[payload].splice(0, state.length, ...durations);
                break;
            case 'Genre':
                newState[payload].splice(0, state.length, ...genres);
                break;
            case 'Date Saved':
                newState[payload].splice(0, state.length, ...saveDates);
                break;
            case 'Release Date':
                newState[payload].splice(0, state.length, ...releaseDates);
                break;
        }
        return newState;
    }

    function displayListReducer(state=null, { type, payload: { value, higher } }) {
        let ratings, duration;
        switch (type) {
            default: return state;
            case 'Age Rating':
                switch (value) {
                    default: return state;
                    case 'G':
                        ratings = higher ? ['G', 'PG-13', 'TV-14', 'R', 'TV-MA', 'NR'] : ['G']; break;
                    case 'PG-13':
                        ratings = higher ? ['PG-13', 'TV-14', 'R', 'TV-MA', 'NR'] : ['G', 'PG-13']; break;
                    case 'TV-14':
                        ratings = higher ? ['TV-14', 'R', 'TV-MA', 'NR'] : ['G', 'PG-13', 'TV-14']; break;
                    case 'R/TV-MA':
                        ratings = higher ? ['R', 'TV-MA', 'NR'] : ['G', 'PG-13', 'TV-14', 'R', 'TV-MA']; break;
                    case 'NR':
                        ratings = higher ? ['NR'] : ['G', 'PG-13', 'TV-14', 'R', 'TV-MA', 'NR']; break;
                }
                return movies.filter(movie => ratings.includes(movie.mpaa_rating));
            case 'Duration':
                switch (value) {
                    default: return state;
                    case '30min': duration = 30; break;
                    case '1h': duration = 60; break;
                    case '1h 30min': duration = 90; break;
                    case '2h': duration = 120; break;
                    case '2h 30min': duration = 150; break;
                    case '3h': duration = 180; break;
                }
                return movies.filter(movie => higher ? movie.duration_in_mins - duration >= 0 : movie.duration_in_mins - duration <= 0);
            case 'Genre':
                return 
            case 'Date Saved':
                return 
            case 'Release Date':
                return movies.filter(movie => {
                    const year = Number(movie.release_date.slice(0, 4));
                    return higher ? year >= Number(value) : year <= Number(value);
                });
        }
    }

    return (
        <>
            <h2>{heading}</h2>
            <form onSubmit={e => {
                e.persist();
                e.preventDefault();
                const children = e.target.children[1].children,
                      type = children[0].options[children[0].selectedIndex].text,
                      payload = {
                          value: children[1].options[children[1].selectedIndex].text,
                          higher: children[2].children[0].checked
                      };
                dispatchDisplayList({ type, payload });
            }}>
                <label>Filter by: </label>
                <span>{filters[0]}</span>
                <span>
                    {filters.length === 1 && <button type="button" onClick={_=> {
                            setSelectID(selectID + 1);
                            setFilters([ ...filters, <div key={filters.length}>{filters[0]}</div> ]);
                        }}> + </button>
                    }
                </span>
                {filters.slice(1, filters.length-1)}
                {filters.length > 1 &&
                    <div style={{ display: 'flex' }}>
                        {filters.slice(filters.length-1, filters.length)}
                        <button type="button" onClick={_=> {
                            setSelectID(selectID + 1);
                            setFilters([ ...filters, <div key={filters.length}>{filters[0]}</div> ]);
                        }}> + </button>
                    </div>
                }
                <br />
                <label>Sort by: </label>
                <label><input type="radio" name="sortByRadio" value="higher" />higher/later</label>
                <label><input type="radio" name="sortByRadio" value="lower" />lower/earlier</label>
                <button>Submit</button>
            </form>
            <ul style={{ display: 'flex' }} >
                {displayList.map((movie, i) =>
                    <li key={i} style={{ marginLeft: '2rem' }}>
                        <Link to={`movies/${movie.id}`} onMouseOver={e => setShowDescription(movie.id)} onMouseOut={e => setShowDescription(false)}>
                            <img src={movie.cover_file} alt="not available" />
                            <br />
                            <label>{movie.title}</label>
                        </Link>
                        {showDescription === movie.id && movie.description && <div>{movie.description === 'Not available' ? 'Description not available' : movie.description}</div>}
                    </li>)}
            </ul>
        </>
    )
}

export default MovieList
