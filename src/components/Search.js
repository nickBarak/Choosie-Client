import React, { useState, useEffect, useContext, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { search } from '../store/actions/search.action';
import Nav from './Nav';
import DelayLink from './DelayLink';
import HistoryContext from '../store/contexts/History.context';
import StarRater from './StarRater';

function Search({ location }) {
    const mounted = useRef(0);
    const history = useContext(HistoryContext);
    const { loading, searchValue, result } = useSelector(store => store.search);
    const dispatch = useDispatch();
    const [page, setPage] = useState(1);
    const user = useSelector(store => store.user.result);

    const nextButton1 = useRef(null),
          nextButton2 = useRef(null),
          previousButton1 = useRef(null),
          previousButton2 = useRef(null);


    useEffect(_=> { document.getElementById('root').style.opacity = 1 }, []
    );

    useEffect(_=> {
        if (!mounted.current && location.page > 1) {
            setTimeout(_=> {
                [nextButton1, nextButton2].forEach(btn => btn.current.style.transform = 'translateX(calc(190px - 1rem))');
                [previousButton1, previousButton2].forEach(btn => {
                    btn.current.style.opacity = 1;
                    btn.current.style.pointerEvents = 'auto';
                });
            }, 150);
        }
        // if (!mounted.current && location.withNext)
        !mounted.current && location.page && setPage(location.page);
    }, []);

    useEffect(_=> {
        if (!location.page || mounted.current++) dispatch( search(user ? user.username : null, searchValue, page) );
    }, [page]);

    useEffect(_=> {
        if (result && (result.length < 11) && nextButton1.current) {
            [nextButton1, nextButton2].forEach(btn => {
                btn.current.style.opacity = 0;
                btn.current.style.pointerEvents = 'none';
            });
        } else if (result && nextButton1.current) {
            [nextButton1, nextButton2].forEach(btn => {
                btn.current.style.opacity = 1;
                btn.current.style.pointerEvents = 'auto';
            });
        }
        if (page === 1 && previousButton1.current) {
            [previousButton1, previousButton2].forEach(btn => {
                btn.current.style.opacity = 0;
                btn.current.style.pointerEvents = 'none';
            });
            [nextButton1, nextButton2].forEach(btn => btn.current.style.transform = 'translateX(0)');
        } else if (previousButton1.current) {
            [previousButton1, previousButton2].forEach(btn => {
                btn.current.style.opacity = 1;
                btn.current.style.pointerEvents = 'auto';
            });
        }
        if (page === 2)
            [nextButton1, nextButton2].forEach(btn => btn.current.style.transform = 'translate(calc(190px - 1rem))');
    }, [result]);

    function onSearch(e) {
        e.persist();
        e.preventDefault();
        setPage(1);
        if (!e.target.children[0].value) return;
        dispatch( search(user ? user.username : null, e.target.children[0].value, page) );
        e.target.reset();
    }

    return (
        <>
            <Nav />
            
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '60vw', marginBottom: !loading && result ? '1.5rem' : '2rem' }}>
                    <label style={{ margin: '.4rem 0', fontSize: '1.3rem' }}>"{searchValue}"</label>
                    <StarRater />
                    <form onSubmit={onSearch}>
                        <input style={{ marginTop: '.8rem' }} className="search" type="text" placeholder="Search actors, genres, directors" />
                    </form>
                </div>
                {loading
                    ? <div>Loading...</div>
                    : !result
                        ? <div>No results found</div>
                        : null
                }
                <div style={{ display: result ? 'block' : 'none', width: '60vw' }}>
                    <div style={{ posiiton: 'relative', display: 'flex', justifyContent: 'space-between', width: '100%', height: '100%' }}>
                        <button ref={previousButton1} className="button-v2" style={{ pointerEvents: 'none', opacity: 0, left: '20vw', transition: 'opacity 550ms ease-in-out' }} onClick={e => {
                            e.target.blur();
                            setPage(page - 1)
                        }}>Previous</button>
                        <button ref={nextButton1} className="button-v2" style={{ left: '20vw', opacity: 1, transition: 'opacity 550ms ease-in-out, transform 550ms ease-in-out' }} onClick={e => {
                            e.target.blur();
                            setPage(page + 1);
                        }}>Next</button>
                    </div>
                    {result && <ul className="search-results">
                        {result.slice(0, 10).map((result, i) =>
                            <li key={i}>
                                <DelayLink to={{
                                    pathname: `movies/${result.id}`,
                                    searchValue,
                                    page,
                                    back: '/search'
                                }}>
                                    <img src={result.cover_file} alt="not available" />
                                </DelayLink>
                                <span className="search-results-info">
                                    <DelayLink to={{
                                        pathname: `movies/${result.id}`,
                                        searchValue,
                                        page,
                                        back: '/search'
                                    }}>
                                        <span style={{ fontSize: '1.3rem', color: 'white', position: 'relative', zIndex: '5' }}>
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
                                        </span>
                                    </DelayLink>
                                </span>
                            </li>
                        )}
                    </ul>}

                    <div style={{ posiiton: 'relative', display: 'flex', justifyContent: 'space-between', width: '100%', height: '100%', transform: 'translateY(-.5rem)', marginBottom: '4rem'}}>
                        <button ref={previousButton2} className="button-v2" style={{ pointerEvents: 'none', opacity: 0, left: '1rem', transition: 'opacity 550ms ease-in-out' }} onClick={e => {
                            e.target.blur();
                            setPage(page - 1)
                        }}>Previous</button>
                        <button ref={nextButton2} style={{ left: '1rem', transition: 'transform 550ms ease-in-out, opacity 550ms ease-in-out' }} className="button-v2" onClick={e => {
                            e.target.blur();
                            setPage(page + 1)
                        }}>Next</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Search
