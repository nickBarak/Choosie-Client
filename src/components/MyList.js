import React, { useState, useEffect, useContext } from 'react';
import UserContext from '../store/contexts/User.context';
import { useDispatch, useSelector } from 'react-redux';
import { makeRequest } from '../store/actions/makeRequest.action';
import Nav from './Nav';
import MovieList from './MovieList';
import BinManager from './BinManager';
import BinManagerContext from '../store/contexts/BinManager.context.js';
import { Link } from 'react-router-dom';

export default function MyList() {

    const dispatch = useDispatch();
    const { loading, result, error } = useSelector(store => store.makeRequest);
    const [binManagerOpen, setBinManagerOpen] = useContext(BinManagerContext);
    const [heading, setHeading] = useState('Here\'s your complete list of movies');
    const [showBins, setShowBins] = useState(false);


    const [user] = useContext(UserContext);

    useEffect(_=> { user && dispatch( makeRequest('movies/list', '?movies=' + user.currently_saved) ) }, []);

    return loading ? <div>Loading...</div> : error ? <div>Error loading movies</div> : (
        <>
            <Nav />
            {user
                ? <MovieList withFilter movies={result} heading={heading.startsWith('This')
                    ? result.length ? heading : 'This bin was empty :('
                    : result.length ? 'Here\'s your complete list of movies' : 'Save movies by going to their page'
                }/>
                : <h2><Link to="/register">Log in</Link> to see your saved movies</h2>
            }
            {user && <div onClick={e => {
                    dispatch( makeRequest('movies/list', '?movies=' + user.currently_saved) );
                    setHeading('Here\'s your complete list of movies');
                }}>Currently Saved</div>
            }
            <div>
                {user ? Object.entries(user.bins).length
                        ? 
                        <>
                            <label onClick={_=> setShowBins(!showBins)}>Your Bins</label>
                            {showBins
                                ? <ul>{Object.keys(user.bins).map((bin, i) => <li key={i} onClick={e => {
                                    dispatch( makeRequest('movies/list', '?movies=' + user.bins[bin]) );
                                    setHeading(`This is what was in "${bin}"`);
                                }}>{bin}</li>)}</ul>
                                : ''
                            }
                        </>
                        : 'Use the bin manager to organize your movies'
                    : null
                }
            </div>
            <br />
            {user ? binManagerOpen
                    ? <BinManager movies={result}></BinManager>
                    : <button onClick={_=> setBinManagerOpen(true)}>Manage Bins</button>
                : null
            }
        </>
    )
}
