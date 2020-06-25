import React, { useState, useReducer, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { server } from '../APIs';
import { updateUser } from '../store/actions/updateUser.action';
import { makeRequest } from '../store/actions/makeRequest.action';
import Filter from './Filter';

function MovieList({ movies, heading, withFilter, displaying }) {
    const [showDescription, setShowDescription] = useState(false);
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
        const controller = new AbortController(),
                { signal } = controller;

            removingFromBin && (async _=> {
                try {
                    let res = await fetch(server + `users/${user.username}/bins`, {
                        signal,
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
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
                        signal,
                        method: 'DELETE',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ movieID: unsaving })
                    });
                    !res.ok && setSaveError('Error unsaving movie');
            
                    let binsWithMovie = Object.entries(user.bins)
                        .filter(bin => bin[1].includes(String(unsaving)));
                    for (let binWithMovie of binsWithMovie) {
                        res = await fetch(server + `users/${user.username}/bins`, {
                            signal,
                            method: 'PATCH',
                            headers: { 'Content-Type': 'application/json' },
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
                        signal,
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
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
        <>
            <h2>{heading}</h2>
            {withFilter && <Filter displayList={displayList} dispatchDisplayList={dispatchDisplayList} />}
            <ul style={{ display: 'flex' }} >
                {displayList.map((movie, i) =>
                    <li key={i} style={{ marginLeft: '3.5rem' }}>
                        <Link to={`movies/${movie.id}`} onMouseOver={e => setShowDescription(movie.id)} onMouseOut={e => setShowDescription(false)}>
                            <img src={movie.cover_file} alt="not available" style={{ borderRadius: '11.5px', boxShadow: '-16px -12px rgb(100,50,50,.9), 12px -22px rgb(50,50,100,.9)',
                            width: '170px', height: '240px', transition: 'height 120ms ease-out, width 120ms ease-out' }} onMouseOver={({target:{style, style:{ width, height }}}) => {
                                style.width = `${1.05 * Number(width.split('px')[0])}px`;
                                style.height = `${1.05 * Number(height.split('px')[0])}px`;
                            }} onMouseOut={({target:{style, style:{ width, height }}}) => {
                                style.width = `${Number(width.split('px')[0]) / 1.05}px`;
                                style.height = `${Number(height.split('px')[0]) / 1.05}px`;
                            }} onDrag={e => {
                                e.preventDefault();
                                e.dataTransfer.setData('text/plain', movie.id);
                            }} />
                            <br />
                            <label>{movie.title}</label>
                        </Link>
                        {displaying === 'Save History'
                            ? <button onClick={_=> setRemovingFromHistory(movie.id)}>{removingFromHistory ? 'Removing...' : 'Remove'}</button>
                            : displaying !== 'Popular'
                                ? displaying === 'Currently Saved'
                                    ? <button onClick={_=> {
                                        let confirmed = true;
                                        if (Object.values(user.bins).reduce((acc, cur) => [...acc, ...cur], []).includes(String(movie.id))) confirmed = window.confirm('This will remove the movie from all bins. Do you still want to unsave it?');
                                        confirmed && setUnsaving(movie.id)
                                    }}>{unsaving ? 'Unsaving...' : 'Unsave'}</button>
                                    : (<>
                                        <button onClick={_=> {
                                            let confirmed = true;
                                            if (Object.entries(user.bins).reduce((acc, [key, val]) => key !== displaying ? [ ...acc, ...val ]  : acc, []).includes(String(movie.id))) confirmed = window.confirm('This will remove the movie from other bins. Do you still want to unsave it?');
                                            confirmed && setUnsaving(movie.id);
                                        }}>{unsaving ? 'Unsaving...' : 'Unsave'}</button>
                                        <button onClick={_=> setRemovingFromBin(movie.id)}>Take Out</button>
                                    </>)
                                : null
                        }
                        {showDescription === movie.id && movie.description && <div>{movie.description === 'Not available' ? 'Description not available' : movie.description}</div>}
                    </li>)}
            </ul>
        </>
    )
}

export default MovieList
