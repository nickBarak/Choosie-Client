import React, { useState, useReducer, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { server } from '../APIs';
import { updateUser } from '../store/actions/updateUser.action';
import { makeRequest } from '../store/actions/makeRequest.action';
import Filter from './Filter';
import imageAlt from '../img/image-alt.png';
import DelayLink from './DelayLink';

function MovieList({ movies, heading, headingMargin, withFilter, displaying, lowerMargin, locationdetails }) {
    console.log(locationdetails);
    const [displayList, dispatchDisplayList] = useReducer(displayListReducer, movies);
    const [unsaving, setUnsaving] = useState(false);
    const [saveError, setSaveError] = useState(null);
    const [removingFromHistory, setRemovingFromHistory] = useState(false);
    const [removingFromHistoryError, setRemovingFromHistoryError] = useState(null);
    const [removingFromBin, setRemovingFromBin] = useState(false);
    const [removingFromBinError, setRemovingFromBinError] = useState(null);
    const user = useSelector(store => store.user.result);
    const dispatch = useDispatch();

    useEffect(_=> {
        dispatchDisplayList();
    }, [movies]);

    useEffect(_=> {
        const controller = new AbortController(),
                { signal } = controller;

            removingFromBin && (async _=> {
                try {
                    let res = await fetch(server + `users/${user.username}/bins`, {
                        mode: 'cors',
                        signal,
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                        body: JSON.stringify({ bin: { [displaying]: user.bins[displaying].filter(id => id !== String(removingFromBin)) } })
                    });
                    !res.ok && setSaveError('Error removing movie from bin');
        
                dispatch( updateUser(user.username) );
                dispatch( makeRequest(`movies/list`, `?movies=${user.bins[displaying].filter(id => id !== String(removingFromBin))}`) );
                } catch (e) { e.name === 'AbortError' && console.log('Removal from bin aborted') }
            })();

            unsaving && (async _=> {
                try {
                    let res;
                    res = await fetch(server + `movies?user=${user.username}`, {
                        mode: 'cors',
                        signal,
                        method: 'DELETE',
                        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                        body: JSON.stringify({ movieID: unsaving })
                    });
                    !res.ok && setSaveError('Error unsaving movie');
            
                    let binsWithMovie = Object.entries(user.bins)
                        .filter(bin => bin[1].includes(String(unsaving)));
                    for (let binWithMovie of binsWithMovie) {
                        res = await fetch(server + `users/${user.username}/bins`, {
                            mode: 'cors',
                            signal,
                            method: 'PATCH',
                            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                            body: JSON.stringify({ bin: { [binWithMovie[0]]: binWithMovie[1].filter(id => id !== String(unsaving)) } })
                        });
                        !res.ok && setSaveError('Error unsaving movie');
                    }
            
                    dispatch( updateUser(user.username) );
                    dispatch( makeRequest(`movies/list`,
                        `?movies=${displaying === 'Currently Saved'
                            ? user.currently_saved.filter(id => id !== unsaving)
                            : user.bins[displaying].filter(id => id !== String(unsaving))}`
                        )
                    );
                } catch (e) { e.name === 'AbortError' && console.log('Unsave aborted') }
            })();

            removingFromHistory && (async _=> {
                try {
                    let res;
                    res = await fetch(server + `users/${user.username}`, {
                        mode: 'cors',
                        signal,
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                        body: JSON.stringify({
                            name: user.name,
                            sex: user.sex,
                            age: user.age,
                            languages: user.languages,
                            country: user.country,
                            email: user.email,
                            show_save_history: user.show_save_history,
                            recent_save_history: user.recent_save_history.filter(id => id !== removingFromHistory)
                        })
                    });
                    !res.ok && setRemovingFromHistoryError('Error removing movie from save history')

                    dispatch( updateUser(user.username) );
                    dispatch( makeRequest(`movies/list`, `?movies=` + user.recent_save_history.filter(id => id !== removingFromHistory)) );
                } catch (e) { e.name === 'AbortError' && console.log('Removal from history aborted') }
            })();

        if (unsaving || removingFromBin || removingFromHistory) return _=> controller.abort();
    }, [unsaving, removingFromBin, removingFromHistory])
    

    function displayListReducer(state, filters) {
        const newState = [ ...movies ];
        if (!filters) return newState;
        for (let { type, payload: { value, range } } of filters) {
            let ratings, duration;
            switch (type) {
                default: break;
                case 'Age Rating':
                    if (range === 'exact') {
                        newState.splice(0, newState.length, ...newState.filter(movie => movie.mpaa_rating === value));
                        break;
                    }
                    switch (value) {
                        default: return state;
                        case 'G':
                            ratings = range === 'higher' ? null : ['G'];
                            break;
                        case 'PG':
                            ratings = range === 'higher' ? ['PG', 'PG-13', 'TV-14', 'R', 'TV-MA', 'NR'] : ['G', 'PG'];
                            break;
                        case 'PG-13':
                            ratings = range === 'higher' ? ['PG-13', 'TV-14', 'R', 'TV-MA', 'NR'] : ['G', 'PG', 'PG-13'];
                            break;
                        case 'TV-14':
                            ratings = range === 'higher' ? ['TV-14', 'R', 'TV-MA', 'NR'] : ['G', 'PG', 'PG-13', 'TV-14'];
                            break;
                        case 'R/TV-MA':
                            ratings = range === 'higher' ? ['R', 'TV-MA', 'NR'] : ['G', 'PG', 'PG-13', 'TV-14', 'R', 'TV-MA'];
                            break;
                        case 'NR':
                            ratings = range === 'higher' ? ['NR'] : null;
                            break;
                    }
                    newState.splice(0, newState.length, ...newState.filter(movie => ratings ? ratings.includes(movie.mpaa_rating) : movies));
                    break;
                case 'Duration':
                    switch (value) {
                        default: break;
                        case '30min': duration = 30; break;
                        case '1h': duration = 60; break;
                        case '1h 30min': duration = 90; break;
                        case '2h': duration = 120; break;
                        case '2h 30min': duration = 150; break;
                        case '3h': duration = 180; break;
                    }
                    if (range === 'exact') {
                        newState.splice(0, newState.length, ...newState.filter(movie => movie.duration_in_mins === duration));
                        break;
                    }
                    newState.splice(0, newState.length, ...newState.filter(movie => range === 'higher' ? movie.duration_in_mins - duration >= 0 : movie.duration_in_mins - duration <= 0));
                    break;
                case 'Genre':
                    newState.splice(0, newState.length, ...newState.filter(movie => movie.genres.filter(genre => value.includes(genre)).length));
                    break;
                case 'Date Saved':
                    break;
                case 'Release Date':
                    if (range === 'exact') {
                        newState.splice(0, newState.length, ...newState.filter(movie => Number(value) === Number(movie.release_date.slice(0, 4))));
                        break;
                    }
                    newState.splice(0, newState.length, ...newState.filter(movie => {
                        const year = Number(movie.release_date.slice(0, 4));
                        return range === 'higher' ? year >= Number(value) : year <= Number(value);
                    }));
                    break;
            }
        }
        return newState;
    }

    return (
        <div style={{ flex: 4, margin: `3rem 3rem ${lowerMargin || '11rem'} 3rem` }}>
            <h2 style={{ textAlign: 'center', marginBottom: headingMargin }}>{heading}</h2>
            {withFilter && <Filter displayList={displayList} dispatchDisplayList={dispatchDisplayList} />}
            <ul id="display-row">
                {displayList.map((movie, i) =>
                    <li key={i}>
                        <DelayLink to={locationdetails
                            ? {
                                pathname: `movies/${movie.id}`,
                                searchValue: locationdetails.searchValue,
                                page: locationdetails.page,
                                back: locationdetails.back
                            }
                            : `movies/${movie.id}`
                        }>
                            <img src={movie.cover_file} onError={e => {
                                e.target.src = imageAlt;
                                e.target.style.width = '200px';
                                e.target.style.height = '267.5px';
                                e.target.style.boxShadow = 'none';
                            }} alt="Not available" onDrag={e => {
                                e.preventDefault();
                                e.dataTransfer.setData('text/plain', movie.id);
                            }} />
                        </DelayLink>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <DelayLink to={locationdetails
                                ? {
                                    pathname: `movies/${movie.id}`,
                                    searchValue: locationdetails.searchValue,
                                    page: locationdetails.page,
                                    back: locationdetails.back
                                }
                                : `movies/${movie.id}`
                            } tabIndex="-1">
                                <label>{movie.title}</label>
                            </DelayLink>
                            {displaying === 'Save History'
                                ? <button className="button-manage-movie" onClick={_=> setRemovingFromHistory(movie.id)}>{removingFromHistory ? 'Removing...' : 'Remove'}</button>
                                : displaying !== 'Popular'
                                    ? displaying === 'Currently Saved'
                                        ? <button className="button-manage-movie" onClick={_=> {
                                            let confirmed = true;
                                            if (Object.values(user.bins).reduce((acc, cur) => [...acc, ...cur], []).includes(String(movie.id))) confirmed = window.confirm('This will remove the movie from all bins. Do you still want to unsave it?');
                                            confirmed && setUnsaving(movie.id)
                                        }}>{unsaving ? 'Unsaving...' : 'Unsave'}</button>
                                        : displaying === 'Query'
                                            ? null
                                            : <span>
                                            <button className="button-manage-movie" onClick={_=> {
                                                let confirmed = true;
                                                if (Object.entries(user.bins).reduce((acc, [key, val]) => key !== displaying ? [ ...acc, ...val ]  : acc, []).includes(String(movie.id))) confirmed = window.confirm('This will remove the movie from other bins. Do you still want to unsave it?');
                                                confirmed && setUnsaving(movie.id);
                                            }}>{unsaving ? 'Unsaving...' : 'Unsave'}</button>
                                            <button className="button-manage-movie" onClick={_=> setRemovingFromBin(movie.id)} style={{ marginLeft: '.25rem' }}>Take Out</button>
                                        </span>
                                    : null
                            }
                        </div>
                        {(!user || user.show_description_on_hover) && <div className="movie-description">
                            {(!movie.description || movie.description === 'Not available')
                                ? 'Description not available'
                                : movie.description.length > 200
                                    ? movie.description.slice(0, 200) + '...'
                                    : movie.description}
                        </div>}
                    </li>)}
            </ul>
        </div>
    )
}

export default MovieList
