import React, { useState, useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { makeRequest } from '../store/actions/makeRequest.action';
import Nav from './Nav';
import { server } from '../APIs';
import HistoryContext from '../store/contexts/History.context';
import { updateUser } from '../store/actions/updateUser.action';
import { transitionPage } from '../Functions';

function Movie({ location: { searchValue, page, back } }) {
    const history = useContext(HistoryContext);
    const location = useLocation();
    const dispatch = useDispatch();
    const movie = useSelector(store => store.makeRequest.result[0]);
    const { loading, error } = useSelector(store => store.makeRequest);
    // const [user, setUser] = useContext(UserContext);
    const [saving, setSaving] = useState(false);
    const [unsaving, setUnsaving] = useState(false);
    const [saveError, setSaveError] = useState(null);
    const user = useSelector(store => store.user.result);

    function saveMovie() {
        setSaving(true);
        fetch(server + `movies?user=${user.username}`, {
            mode: 'cors',
            method: user.save_history.includes(movie.id) ? 'PUT' : 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({ movieID: movie.id, inRecent: user.recent_save_history.includes(movie.id) })
        })
            .then(res => {
                if (res.ok) {
                    setSaving(false);
                    dispatch( updateUser(user.username) );
                } else setSaveError('Error saving movie')
            })
            .catch(e => setSaveError('Error saving movie'));
    }

    useEffect(_=> { document.getElementById('root').style.opacity = 1 }, []
    );

    useEffect(_=> dispatch( makeRequest('movies', '?id=' + location.pathname.split('/movies/')[1]) ), []);

    useEffect(_=> {
        const controller = new AbortController(),
              { signal } = controller;
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
                setUnsaving(false);
            } catch (e) { e.name === 'AbortError' && console.log('Unsave aborted') }
        })();

        return _=> controller.abort();
    }, [unsaving])

    if (!movie) return <div>Error loading movie</div>

    return (
        <>
                {loading ? <div>Loading...</div> : error ? <div>Error loading movie</div> : (
            <>
                <Nav withBack searchValue={searchValue} page={page} back={back} />
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', transform: 'translateY(-3.5rem)' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '60vw' }}><img className="image-movie" src={movie.cover_file} alt="not available" />
                    <label style={{ fontWeight: 'bold', margin: '1rem 0 .2rem 0' }}>{movie.title}</label>
                    {user
                        ? user.currently_saved.includes(movie.id)
                            ? <button className="button-manage-movie" onClick={_=> {
                                let confirmed = true;
                                if (Object.values(user.bins).reduce((acc, cur) => [...acc, ...cur], []).includes(String(movie.id))) confirmed = window.confirm('This will remove the movie from all bins. Do you still want to unsave it?');
                                confirmed && setUnsaving(movie.id)
                            }}>{unsaving ? 'Unsaving movie...' : 'Unsave Movie'}</button>
                            : <button className="button-manage-movie" onClick={saveMovie}>{saving ? 'Saving movie...' : 'Save to My List'}</button>
                        : <button className="button-manage-movie" onClick={_=> transitionPage(history, '/register')}>Sign in to save this movie</button>}
                        {movie.description && <div style={{ margin: '2.5rem 0 3rem 0', textAlign: 'justify'}}>{movie.description === 'Not available' ? 'Description not available' : movie.description}</div>}
                    </div>
                    <ul className="info-movie">
                        <li>
                            <label>Genres: </label>
                            {movie.genres && <span>{movie.genres.join(', ') || 'Not available'}</span>}
                        </li>
                        <li>
                            <label>Rating: </label>
                            {movie.mpaa_rating && <span>{movie.mpaa_rating || 'Not available'}</span>}
                        </li>
                        <li>
                            <label>Duration: </label>
                            {movie.duration_in_mins
                                ? movie.duration_in_mins % 60
                                    ? movie.duration_in_mins >= 60
                                        ? <span>{Math.floor(movie.duration_in_mins / 60)}h {movie.duration_in_mins % 60}min</span>
                                        : <span>{movie.duration_in_mins} min</span>
                                    : <span>{movie.duration_in_mins % 60}h</span>
                                : 'Not available'}
                        </li>
                        <li>
                            <label>Release Date: </label>
                            {movie.release_date && <span>{movie.release_date.slice(0, 4) || 'Not available'}</span>}
                        </li>
                        <li>
                            <label>Writers: </label>
                            {movie.writers && <span>{movie.writers.join(', ') || 'Not available'}</span>}
                        </li>
                        <li>
                            <label>Directors: </label>
                            {movie.directors && <span>{movie.directors.join(', ') || 'Not available'}</span>}
                        </li>
                        <li>
                            <label>Actors: </label>
                            {movie.actors && <span>{movie.actors.join(', ') || 'Not available'}</span>}
                        </li>
                        <li>
                            <label>Languages: </label>
                            {movie.languages && <span>{movie.languages.join(', ') || 'Not available'}</span>}
                        </li>
                        <li>
                            <label>Countries: </label>
                            {movie.countries && <span>{movie.countries.join(', ') || 'Not available'}</span>}
                        </li>
                    </ul>
                </div>
            </>
            )}
        </>)
}

export default Movie
