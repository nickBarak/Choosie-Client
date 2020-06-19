import React, { useState, useEffect } from 'react';
import Nav from './Nav';
import MovieList from './MovieList';

const url = 'x.com';

function Popular() {

    const [movies, setMovies] = useState({});

    useEffect(_=> {
        fetch(url)
            .then(res => res.json())
            .then(data => setMovies(data))
            .catch(e => console.error(e))
    }, []);

    return (
        <>
            <Nav />
            <MovieList movies={movies} heading="Here's what we have for popular movies"/>
        
        </>
    )
}

export default Popular
