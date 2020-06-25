import React, { useState, useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
// import UserContext from '../store/contexts/User.context';
import { makeRequest } from '../store/actions/makeRequest.action';
import Nav from './Nav';
import { server } from '../APIs';
import HistoryContext from '../store/contexts/History.context';
import { updateUser } from '../store/actions/updateUser.action';

function Movie() {
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
            method: user.save_history.includes(movie.id) ? 'PUT' : 'POST',
            headers: { 'Content-Type': 'application/json' },
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

    useEffect(_=> dispatch( makeRequest('movies', '?id=' + location.pathname.split('/movies/')[1]) ), []);

    useEffect(_=> {
        const controller = new AbortController(),
              { signal } = controller;
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
                setUnsaving(false);
            } catch (e) { e.name === 'AbortError' && console.log('Unsave aborted') }
        })();

        return _=> controller.abort();
    }, [unsaving])

    if (!movie) return <div>Error loading movie</div>

    return loading ? <div>Loading...</div> : error ? <div>Error loading movie</div> : (
        <>
            <Nav />
            <img src={movie.cover_file} alt="not available" />
            {user
                ? user.currently_saved.includes(movie.id)
                    ? <button onClick={_=> {
                        let confirmed = true;
                        if (Object.values(user.bins).reduce((acc, cur) => [...acc, ...cur], []).includes(String(movie.id))) confirmed = window.confirm('This will remove the movie from all bins. Do you still want to unsave it?');
                        confirmed && setUnsaving(movie.id)
                    }}>{unsaving ? 'Unsaving movie...' : 'Unsave Movie'}</button>
                    : <button onClick={saveMovie}>{saving ? 'Saving movie...' : 'Save to My List'}</button>
                : <button onClick={_=> history.push('/register')}>Sign in to save this movie</button>}
            <br />
            <label style={{ fontWeight: 'bold' }}>{movie.title}</label><br /><br />
            {movie.description && <div>{movie.description === 'Not available' ? 'Description not available' : movie.description}</div>}<br />
            {movie.genres && <div>Genres: {movie.genres.join(', ')}</div>}<br />
            {movie.mpaa_rating && <div>Rating: {movie.mpaa_rating}</div>}<br />
            {movie.duration_in_mins ? movie.duration_in_mins % 60
                ? movie.duration_in_mins >= 60
                    ? <div>Duration: {Math.floor(movie.duration_in_mins / 60)}h {movie.duration_in_mins % 60}min</div>
                    : <div>Duration: {movie.duration_in_mins} min</div>
                : <div>Duration: {movie.duration_in_mins % 60}h</div>
            : null}<br />
            {movie.release_date && <div>Release Date: {movie.release_date.slice(0, 4)}</div>}<br />
            {movie.writers && <div>Writers: {movie.writers.join(', ')}</div>}<br />
            {movie.directors && <div>Directors: {movie.directors.join(', ')}</div>}<br />
            {movie.actors && <div>Actors: {movie.actors.join(', ')}</div>}<br />
            {movie.languages && <div>Languages: {movie.languages.join(', ')}</div>}<br />
            {movie.countries && <div>Countries: {movie.countries.join(', ')}</div>}<br />            
        </>
    )
}

export default Movie
