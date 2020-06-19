import React, { useState, useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import UserContext from '../store/contexts/User.context';
import { makeRequest } from '../store/actions/makeRequest.action';
import Nav from './Nav';
import { server } from '../APIs';
import HistoryContext from '../store/contexts/History.context';

function Movie() {
    const history = useContext(HistoryContext);
    const location = useLocation();
    const dispatch = useDispatch();
    const movie = useSelector(store => store.makeRequest.result[0]);
    const { loading, error } = useSelector(store => store.makeRequest);
    const [user, setUser] = useContext(UserContext);
    const [saving, setSaving] = useState(false);
    const [unsaving, setUnsaving] = useState(false);
    const [saveError, setSaveError] = useState(null);

    function saveMovie() {
        setSaving(true);
        fetch(server + `users/${user.username}/movies`, {
            method: user.save_history.includes(movie.id) ? 'PUT' : 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ movieID: movie.id })
        })
            .then(res => {
                if (res.ok) {
                    setSaving(false);
                    setUser({
                        ...user,
                        currently_saved: [ ...user.currently_saved, movie.id ],
                        save_history: user.save_history.includes(movie.id)
                            ? user.save_history
                            : [ ...user.save_history, movie.id ]
                    })
                } else setSaveError('Error saving movie')
            })
            .catch(e => setSaveError('Error saving movie'));
    }

    function unsaveMovie() {
        setUnsaving(true);
        fetch(server + `users/${user.username}/movies`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ movieID: movie.id })
        })
            .then(res => {
                if (res.ok) {
                    setUnsaving(false);
                    setUser({
                        ...user,
                        currently_saved: user.currently_saved.filter(el => el !== movie.id)
                    })
                } else setSaveError('Error unsaving movie')
            })
            .catch(e => setSaveError('Error unsaving movie'));
    }

    useEffect(_=> dispatch( makeRequest('movies', 'id', location.pathname.split('/')[2]) ), [])

    if (!movie) return <div>Error loading movie</div>

    return loading ? <div>Loading...</div> : error ? <div>Error loading movie</div> : (
        <>
            <Nav />
            <img src={movie.cover_file} alt="not available" />
            {user
                ? user.currently_saved.includes(movie.id)
                    ? <button onClick={unsaveMovie}>{unsaving ? 'Unsaving movie...' : 'Unsave Movie'}</button>
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
