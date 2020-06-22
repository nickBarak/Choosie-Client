import React, { useState, useEffect } from 'react';
import Nav from './Nav';
import MovieList from './MovieList';
import { makeRequest } from '../store/actions/makeRequest.action';
import { useDispatch, useSelector } from 'react-redux';

const url = 'x.com';

function Popular() {
    const dispatch = useDispatch();
    const { loading, error, result } = useSelector(store => store.makeRequest);
    const [heading, setHeading] = useState('Here\'s what movies are currently trending');

    useEffect(_=> { dispatch( makeRequest('popular', '?column=release_date') ) }, []);

    return (
        <>
            <Nav />
            {error && <div>{error}</div>}
            {loading
                ? <div>Loading movies...</div>
                : <MovieList movies={result} heading={heading}/>
                
            }
            <ul>
                <li key="0" onClick={_=> dispatch( makeRequest('popular', '?column=release_date') )}>Trending</li>
                <li key="1" onClick={_=> dispatch( makeRequest('popular', '?column=release_date') )}>Recent Releases</li>
                <li key="2" onClick={_=> dispatch( makeRequest('popular', '?column=times_saved_this_month') )}>Most Saved This Month</li>
                <li key="3" onClick={_=> dispatch( makeRequest('popular', '?column=times_saved') )}>Most Saved All Time</li>
            </ul>
        </>
    )
}

export default Popular
