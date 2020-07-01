import React, { useState, useEffect, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { search } from '../store/actions/search.action';
import Nav from './Nav';
import { Link } from 'react-router-dom';
import HistoryContext from '../store/contexts/History.context';
import StarRater from './StarRater';

function Search() {
    const history = useContext(HistoryContext);
    const { loading, searchValue, result } = useSelector(store => store.search);
    const dispatch = useDispatch();
    const [page, setPage] = useState(1);
    const user = useSelector(store => store.user.result);

    useEffect(_=> dispatch( search(user ? user.username : null, searchValue, page) ), [page]);

    function onSearch(e) {
        e.persist();
        e.preventDefault();
        if (!e.target.children[0].value) return;
        dispatch( search(user ? user.username : null, e.target.children[0].value, page) );
        e.target.reset();
    }

    return (
        <>
            <Nav />
            <form onSubmit={onSearch}>
                <input type="text" placeholder="Search actors, genres, directors" />
                <label> Results for: "{searchValue}"</label>
            </form>
            <StarRater />
            {loading
                ? <div>Loading...</div>
                : !result
                    ? <div>{'No results found'}</div>
                    : (
                    <>
                        {page > 1 && <button onClick={_=> setPage(page-1)}>Previous</button>}
                        {result.length === 11 && <button onClick={_=> setPage(page+1)}>Next</button>}
                        <ul>
                            {result.slice(0, 10).map((result, i) =>
                                <li key={i}>
                                    <Link to={`movies/${result.id}`}>
                                        <img src={result.cover_file} alt="not available" />
                                        <label>{result.title}</label>
                                        <span> | {result.genres.join(', ')}</span>
                                        <span> | {result.mpaa_rating}</span>
                                        {result.duration_in_mins % 60
                                            ? result.duration_in_mins >= 60
                                                ? <span> | {Math.floor(result.duration_in_mins / 60)}h {result.duration_in_mins % 60} min</span>
                                                : <span> | {result.duration_in_mins} min</span>
                                            : <span> | {result.duration_in_mins % 60}h</span>
                                        }
                                        <span> | {result.release_date.slice(0, 4)}</span>
                                    </Link>
                                </li>
                            )}
                        </ul>
                        {page > 1 && <button onClick={_=> setPage(page-1)}>Previous</button>}
                        {result.length === 11 && <button onClick={_=> setPage(page+1)}>Next</button>}
                    </>
                    )
            }
            
        </>
    )
}

export default Search
