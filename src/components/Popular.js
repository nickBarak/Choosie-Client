import React, { useState, useEffect } from 'react';
import Nav from './Nav';
import MovieList from './MovieList';
import { makeRequest } from '../store/actions/makeRequest.action';
import { useDispatch, useSelector } from 'react-redux';

function Popular() {
    const dispatch = useDispatch();
    const { loading, error, result } = useSelector(store => store.makeRequest);
    const [heading, setHeading] = useState('Here\'s what movies are currently trending');
    const [set, setSet] = useState(1);
    const [column, setColumn] = useState('release_date');

    useEffect(_=> dispatch( makeRequest(`popular`, `?column=${column}&set=${set}`)), [column, set]);

    return (
        <>
            <Nav />
            {error && <div>{error}</div>}
            {loading
                ? <div>Loading movies...</div>
                : <MovieList movies={result} heading={heading} displaying={'Popular'}/>    
            }
            <div>
                {set > 1 && <button onClick={_=> setSet(set - 1)}>Previous</button>}
                <button onClick={_=> setSet(set + 1)}>Next</button>
            </div>

            <ul>
                <li key="0" onClick={_=> setColumn('release_date')}>Trending</li>
                <li key="1" onClick={_=> setColumn('release_date')}>Recent Releases</li>
                <li key="2" onClick={_=> setColumn('times_saved_this_month')}>Most Saved This Month</li>
                <li key="3" onClick={_=> setColumn('times_saved')}>Most Saved All Time</li>
            </ul>
        </>
    )
}

export default Popular
