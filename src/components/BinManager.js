import React, { useState, useEffect, useContext, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { server } from '../APIs';
// import UserContext from '../store/contexts/User.context';
import BinManagerContext from '../store/contexts/BinManager.context.js';
import { updateUser } from '../store/actions/updateUser.action';
import { makeRequest } from '../store/actions/makeRequest.action';

function BinManager({ movies, displaying, setDisplaying }) {
    // const [user, setUser] = useContext(UserContext);
    const dispatch = useDispatch();
    const user = useSelector(store => store.user.result);

    const [error, setError] = useState(null);
    const [deleteBin, setDeleteBin] = useState(true);
    const [addMovie, setAddMovie] = useState(true);
    const [updateBinClicked, setUpdateBinClicked] = useState(false);
    const [binToUpdate, setBinToUpdate] = useState(null);
    const [, setBinManagerOpen] = useContext(BinManagerContext);


    async function manageBins(e, method, bin, callback, errorhandler = _=> console.log('Error managing bins', e)) {
        e.persist();
        e.preventDefault();
        const formData = new FormData();
        formData.append('bin', typeof bin === 'string' ? bin : JSON.stringify(bin));
        try {
            const response = await fetch(server + `users/${user.username}/bins`, {
                mode: 'cors',
                method,
                body: formData
            });
            setError(null) || response.ok
                ? callback && callback()
                : errorhandler()
        } catch (e) { errorhandler() }
    }

    function createBin(e) {
        e.persist();
        e.preventDefault();
        if (Object.keys(user.bins).includes(e.target.children[1].value)) return setError('Bin already exists');
        user && manageBins(e, 'POST', { [e.target.children[1].value]: [] },
            _=> dispatch( updateUser(user.username) ),
            _=> setError('Error creating bin')
        );
        e.target.reset();
    }

    function deleteOrEmptyBin(e) {
        const bin = e.target.children[1].options[e.target.children[1].selectedIndex].text;
        user && manageBins(e, deleteBin ? 'DELETE' : 'PUT', deleteBin ? bin : { [bin]: [] },
            _=> {
                dispatch( updateUser(user.username) );
                if (displaying === bin && deleteBin) {
                    dispatch( makeRequest('movies/list', '?movies=' + movies.map(movie => movie.id)) );
                    setDisplaying('Currently Saved');
                } else if (!deleteBin) {
                    dispatch( makeRequest('movies/list', '?movies=') );
                }
            },
            _=> setError(`Error ${deleteBin ? 'deleting' : 'emptying'} bin`)
        )
    }

    function updateBin(e) {
        e.persist();
        e.preventDefault();
        const toUpdate = e.target.children[1].options[e.target.children[1].selectedIndex];
        if (!updateBinClicked) {
            setUpdateBinClicked(true);
            setBinToUpdate(toUpdate.text);
        } else {
            const updatedMovies = addMovie
                ? [ ...user.bins[binToUpdate], toUpdate.value ]
                : user.bins[binToUpdate].filter(movie => movie !== toUpdate.value);
            user && fetch(server + `users/${user.username}/bins`, {
                mode: 'cors',
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    bin: { [binToUpdate]: updatedMovies }
                })
            })
                .then(res => {
                    if (res.ok) {
                        dispatch( updateUser(user.username) );
                        dispatch( makeRequest('movies/list', '?movies=' + updatedMovies) );
                    } else setError('Error updating bin');
                });
            setDisplaying(binToUpdate);
            setUpdateBinClicked(false);
            setBinToUpdate(null);
            e.target.reset();
        }
    }

    return (
        <div className="bin-manager">
            {error && <div style={{ color: 'maroon' }}>{error}</div>}
            <label style={{ fontWeight: 600 }}>Bin Manager</label>
            <form onSubmit={createBin}>
                <label className="label-bin-manager">Create a new bin</label>
                <input style={{ borderRadius: '2px', padding: '.25rem', height: '1.35rem' }} type="text" placeholder="Enter bin name" autoComplete="off" />
                <button className="button-register">Create Bin</button>
            </form>
            {Object.keys(user.bins).length > 0 &&
            <>
                <form onSubmit={updateBin}>
                    <label className="label-bin-manager">Add movies to a bin or remove them</label>
                    <select style={{ marginRight: '.5rem' }}>
                        {user.currently_saved.length
                            ? updateBinClicked
                                ? addMovie
                                    ? user.currently_saved
                                        .filter(id => !user.bins[binToUpdate].includes(String(id)))
                                        .map((id, i) => <option key={i} value={id}>{movies.find(movie => movie.id === id).title}</option>)
                                    : user.bins[binToUpdate]
                                        .map((id, i) => <option key={i} value={id}>{movies.find(movie => movie.id === Number(id)).title}</option>)
                                : addMovie
                                    ? Object.entries(user.bins).filter(([, val]) => val.length < user.currently_saved.length).length
                                        ? Object.entries(user.bins).filter(([, val]) => val.length < user.currently_saved.length)
                                            .map(([key], i) => <option key={i}>{key}</option>)
                                        : <option key="-1">All bins are full</option>
                                    : Object.entries(user.bins).filter(([, val]) => val.length).length
                                        ? Object.entries(user.bins).filter(([, val]) => val.length)
                                            .map(([key], i) => <option key={i}>{key}</option>)
                                        : <option key="-1">All bins are empty</option>
                            : <option key="-1">You don't have any saved movies!</option>
                        }
                    </select>
                    {!updateBinClicked && user.currently_saved.length > 0 &&
                    (<>
                        <label><input type="radio" name="addOrRemoveMovie" value="Add" defaultChecked onChange={e => setAddMovie(!addMovie)}/>Add</label>
                        <label style={{ marginLeft: '.35rem' }}><input type="radio" name="addOrRemoveMovie" value="Remove" onChange={e => setAddMovie(!addMovie)} />Remove</label>
                    </>)}
                    {Object.entries(user.bins)
                        .filter(([, val]) => addMovie
                            ? val.length < user.currently_saved.length
                            : val.length > 0).length > 0
                            && <button className="button-register">{updateBinClicked ? 'Update Bin' : addMovie ? 'Add To' : 'Remove From'}</button>
                    }
                </form>
                <form onSubmit={deleteOrEmptyBin}>
                    <label className="label-bin-manager">Delete or empty a bin</label>
                    <select style={{ marginRight: '.5rem' }}>
                        {Object.entries(user.bins)
                            .filter(([, val]) => deleteBin || val.length)
                            .map((bin, i) => <option key={i}>{bin}</option>).length
                                ? Object.entries(user.bins)
                                    .filter(([, val]) => deleteBin || val.length)
                                    .map(([key], i) => <option key={i}>{key}</option>)
                                : <option key="-1">All bins are empty</option>
                        }
                    </select>
                    <label><input type="radio" name="deleteOrEmptyBin" value="Delete" defaultChecked onChange={e => setDeleteBin(!deleteBin)}/>Delete</label>
                    <label style={{ marginLeft: '.35rem' }}><input type="radio" name="deleteOrEmptyBin" value="Empty" onChange={e => setDeleteBin(!deleteBin)} />Empty </label>
                    {Object.entries(user.bins)
                        .filter(([, val]) => deleteBin || val.length)
                        .map((bin, i) => <option key={i}>{bin}</option>).length > 0 &&
                            <button className="button-register">{deleteBin ? 'Delete' : 'Empty'} Bin</button>
                    }
                </form>
            </>
            }
            {Object.keys(user.bins).length > 0 && <button className="button-register" onClick={_=> setBinManagerOpen(false)}>Close</button>}
        </div>
    )
}

export default BinManager
