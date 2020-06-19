import React, { useState, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { search } from '../store/actions/search.action';
import Nav from './Nav';
import { server } from '../APIs';
import UserContext from '../store/contexts/User.context';
import { Link } from 'react-router-dom';
import HistoryContext from '../store/contexts/History.context';

function Search() {
    const history = useContext(HistoryContext);
    const { loading, searchValue, result } = useSelector(store => store.search);
    const dispatch = useDispatch();
    
    const [user] = useContext(UserContext);

    const [searchRating, setSearchRating] = useState(0);

    function onSearch(e) {
        e.persist();
        e.preventDefault();
        if (!e.target.children[0].value) return;
        dispatch( search(user ? user.id : null, e.target.children[0].value) );
        e.target.reset();
    }

    function rateSearch(rating) {
        setSearchRating(rating);
        try {
            fetch(server + 'search', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ rating, username: user ? user.username : null })
            })
        } catch (e) { console.log(e) }
    }

    return (
        <>
            <Nav />
            <form onSubmit={onSearch}>
                <input type="text" placeholder="Search actors, genres, directors" />
                <label> Results for: "{searchValue}"</label>
            </form>
            <div>
                <label>How would you rate our suggestions?</label>
                <div>
                    {[1,2,3,4,5].map(el => searchRating >= el
                        ? <i key={el} className="fas fa-star" onClick={_=> rateSearch(el)} style={{ cursor: 'pointer' }} />
                        : <i key={el} className="far fa-star" onClick={_=> rateSearch(el)} style={{ cursor: 'pointer' }} />
                    )}
                </div>
            </div>
            {loading
                ? <div>Loading...</div>
                : !result
                    ? <div>{'No results found'}</div>
                    : <ul>{result.map((result, i) =>
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
                    )}</ul>
            }
        </>
    )
}

export default Search
