import React, { useState, useEffect, useContext, useRef } from 'react';
import { server } from '../APIs';
import UserContext from '../store/contexts/User.context';
import BinManagerContext from '../store/contexts/BinManager.context.js';

function BinManager({ movies }) {
    console.log(movies);
    const [user, setUser] = useContext(UserContext);
    const [error, setError] = useState(null);
    const [deleteBin, setDeleteBin] = useState(true);
    const [addMovie, setAddMovie] = useState(true);
    const [updateBinClicked, setUpdateBinClicked] = useState(false);
    const [binToUpdate, setBinToUpdate] = useState(null);
    const [, setBinManagerOpen] = useContext(BinManagerContext);

    async function manageBins(e, method, bin, callback, errorhandler = _=> console.log(e)) {
        e.persist();
        e.preventDefault();
        const formData = new FormData();
        formData.append('bin', typeof bin === 'string' ? bin : JSON.stringify(bin));
        try {
            const response = await fetch(server + `users/${user.username}/bins`, {
                method,
                body: formData
            });
            response.ok
                ? callback && callback()
                : errorhandler()
        } catch (e) { errorhandler() }
    }

    function createBin(e) {
        user && manageBins(e, 'POST', { [e.target.children[1].value]: [] },
            _=> setUser({ ...user, bins: { ...user.bins, [e.target.children[1].value]: [] }}),
            _=> setError('Error creating bin')
        );
        e.target.reset();
    }

    function deleteOrEmptyBin(e) {
        const bin = e.target.children[1].options[e.target.children[1].selectedIndex].text;
        user && manageBins(e, deleteBin ? 'DELETE' : 'PUT', deleteBin ? bin : { [bin]: [] },
            _=> setUser({ ...user, bins: Object.entries(user.bins).reduce((acc, cur) => (cur[0] !== bin
                ? { ...acc, [cur[0]]: cur[1] }
                : deleteBin
                    ? acc
                    : { ...acc, [cur[0]]: [] }
            ), {})
            }),
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
        } else user && fetch(server + `users/${user.username}/bins`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                bin: { [binToUpdate]: addMovie
                    ? [ ...user.bins[binToUpdate], toUpdate.value ]
                    : user.bins[binToUpdate].filter(movie => movie !== toUpdate.value)
                }
            })
        })
            .then(res => {
                setUser({ ...user, bins: Object.entries(user.bins)
                    .reduce((acc, cur) => cur[0] === toUpdate.text
                        ? { ...acc, [cur[0]]: addMovie
                            ? [ ...cur[0], toUpdate.value ]
                            : cur[1].filter(el => el !== toUpdate.value) }
                        : { ...acc, [cur[0]]: cur[1] },
                    {})
                })
                setUpdateBinClicked(false);
                setBinToUpdate(null);
                e.target.reset();
            })
            .catch(e => setError('Error updating bin'))
    }

    return (
        <>
            {error && <div style={{ color: 'maroon' }}>{error}</div>}
            <label>Bin Manager</label>
            <form onSubmit={createBin}>
                <label>Create a new bin</label>
                <input type="text" placeholder="Enter bin name" autoComplete="off" />
                <button>Create Bin</button>
            </form>
            <form onSubmit={updateBin}>
                <label>Add movies to a bin or remove them</label>
                <select>
                    {updateBinClicked
                        ? addMovie
                            ? user.currently_saved
                                .filter(id => !user.bins[binToUpdate].includes(String(id)))
                                .map((id, i) => <option key={i} value={id}>{movies.find(movie => movie.id === id).title}</option>)
                            : user.bins[binToUpdate]
                                .map((id, i) => <option key={i} value={id}>{movies.find(movie => movie.id === Number(id)).title}</option>)
                        : Object.keys(user.bins).map((bin, i) => <option key={i}>{bin}</option>)
                    }
                </select>
                <label><input type="radio" name="addOrRemoveMovie" value="Add" defaultChecked onChange={e => setAddMovie(!addMovie)}/>Add</label>
                <label><input type="radio" name="addOrRemoveMovie" value="Remove" onChange={e => setAddMovie(!addMovie)} />Remove </label>
                <button>{addMovie ? 'Add' : 'Remove'} Movie</button>
            </form>
            <form onSubmit={deleteOrEmptyBin}>
                <label>Delete or empty a bin</label>
                <select>
                    {user && Object.entries(user.bins).length 
                        ? Object.keys(user.bins).map((bin, i) => <option key={i}>{bin}</option>)
                        : <option>You got no bins m8</option>
                    }
                </select>
                <label><input type="radio" name="deleteOrEmptyBin" value="Delete" defaultChecked onChange={e => setDeleteBin(!deleteBin)}/>Delete</label>
                <label><input type="radio" name="deleteOrEmptyBin" value="Empty" onChange={e => setDeleteBin(!deleteBin)} />Empty </label>
                <button>{deleteBin ? 'Delete' : 'Empty'} Bin</button>
            </form>
            <button onClick={_=> setBinManagerOpen(false)}>Close</button>
        </>
    )
}

export default BinManager
