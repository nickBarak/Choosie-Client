import React, { useState, useEffect, useContext } from 'react';
// import UserContext from '../store/contexts/User.context';
import { useDispatch, useSelector } from 'react-redux';
import { makeRequest } from '../store/actions/makeRequest.action';
import { getCurrentlySaved } from '../store/actions/getCurrentlySaved.action';
import Nav from './Nav';
import MovieList from './MovieList';
import BinManager from './BinManager';
import BinManagerContext from '../store/contexts/BinManager.context.js';
import { Link } from 'react-router-dom';
import { server } from '../APIs';
import { updateUser } from '../store/actions/updateUser.action';

export default function MyList() {

    const dispatch = useDispatch();
    const { loading, result, error } = useSelector(store => store.makeRequest);
    const [binManagerOpen, setBinManagerOpen] = useContext(BinManagerContext);
    const [showBins, setShowBins] = useState(false);
    const user = useSelector(store => store.user.result);
    const currentlySaved = useSelector(store => store.currentlySaved.result);
    const [displaying, setDisplaying] = useState('Currently Saved');
    const [creatingBin, setCreatingBin] = useState(false);
    const [creatingBinError, setCreatingBinError] = useState(null);
    const [updatingBinError, setUpdatingBinError] = useState(null);

    useEffect(_=> {
        if (user) {
            dispatch( makeRequest('movies/list', '?movies=' + user.currently_saved) );
            dispatch( getCurrentlySaved(user.currently_saved) );
        }
    }, []);

    async function createBin(e) {
        e.persist();
            e.preventDefault();
            const binName = e.target.children[0].value;
        try {
            if (Object.keys(user.bins).includes(binName)) return setCreatingBinError('Bin already exists');
            setCreatingBinError(null);
            const formData = new FormData();
            formData.append('bin', JSON.stringify({ [binName]: [] }) );
                const response = await fetch(server + `users/${user.username}/bins`, {
                    method: 'POST',
                    body: formData
                });
                if (response.ok) {
                    dispatch( updateUser(user.username) );
                } else setCreatingBinError('Error creating bin');
        } catch (e) { console.log(e) }
        finally {
            if (!Object.keys(user.bins).includes(binName)) {
                setCreatingBin(false);
                e.target.reset();
            }
        }
    }

    async function updateBin(e) {
        e.persist();
        e.preventDefault();
        setUpdatingBinError(null);
        let res;
        const id = e.dataTransfer.getData('text/plain').split('/movies/')[1];
        try {
            if (!user.currently_saved.includes(Number(id))) {
                res = await fetch(server + `movies?user=${user.username}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ movieID: Number(id), inRecent: true })
                });
                !res.ok && setUpdatingBinError('Error updating bin');
            }

            res = await fetch(server + `users/${user.username}/bins`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    bin: { [e.target.textContent]: [ ...user.bins[e.target.textContent], id ] }
                })
            });
            res.ok
                ? dispatch( updateUser(user.username) )
                : setUpdatingBinError('Error updating bin');
        } catch (e) { console.log(e) }
    }

return loading ? <div>Loading...</div> : error ? <div>Error loading movies</div> : (
        <>
            <Nav />
            {user
                ? <MovieList withFilter displaying={displaying} movies={result} heading={(_=> {
                    switch (displaying) {
                        default: return result.length
                            ? `This is what was in "${displaying}"`
                            : 'This bin was empty!';
                        case 'Currently Saved':
                            return result.length
                                ? 'Here\'s your complete list of movies'
                                : 'Save movies by going to their page';
                        case 'Save History':
                            return result.length
                                ? 'These are all the movies you\'ve ever saved'
                                : 'Save movies by going to their page';
                    }
                })()}/>
                : <h2><Link to="/register">Log in</Link> to see your saved movies</h2>
            }
            {user && <div onClick={e => {
                    dispatch( makeRequest('movies/list', '?movies=' + user.currently_saved) );
                    setDisplaying('Currently Saved');
                }}>Currently Saved</div>
            }
            {user && user.show_save_history && <div onClick={e => {
                    dispatch( makeRequest('movies/list', '?movies=' + user.recent_save_history) );
                    setDisplaying('Save History');
                }}>Save History</div>
            }
            <div>
                {user ? Object.entries(user.bins).length
                        ? 
                        <>
                            <label onClick={_=> setShowBins(!showBins)}>Your Bins</label>
                            {creatingBinError && <div style={{ color: 'maroon' }}>{creatingBinError}</div>}
                            {showBins
                                ? <ul>
                                    {Object.keys(user.bins).map((bin, i) =>
                                        <li key={i} onClick={e => {
                                            dispatch( makeRequest('movies/list', '?movies=' + user.bins[bin]) );
                                            setDisplaying(bin);
                                        }} onDrop={e => {
                                            e.preventDefault();
                                            window.confirm('Save movie and add to bin?') && updateBin(e);
                                        }} onDragOver={e => { e.preventDefault(); e.target.style.color = 'blue' }} onDragLeave={e => { e.preventDefault(); e.target.style.color = 'black' }}>
                                            {bin}
                                        </li>
                                    )}
                                    <li>
                                        {creatingBin
                                            ? <form onSubmit={createBin}>
                                                <input type="text" placeholder="Enter bin name" />
                                            </form>
                                            : <button onClick={_=> setCreatingBin(true)}>+</button>
                                        }
                                    </li>
                                </ul>
                                : ''
                            }
                        </>
                        : 'Use the bin manager to organize your movies'
                    : null
                }
            </div>
            <br />
            {user ? binManagerOpen
                    ? <BinManager movies={currentlySaved} displaying={displaying} setDisplaying={setDisplaying}></BinManager>
                    : <button onClick={_=> setBinManagerOpen(true)}>Manage Bins</button>
                : null
            }
        </>
    )
}
