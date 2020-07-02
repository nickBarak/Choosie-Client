import React, { useState, useEffect } from 'react';
import Nav from './Nav';
import MovieList from './MovieList';
import { makeRequest } from '../store/actions/makeRequest.action';
import { useDispatch, useSelector } from 'react-redux';

function Popular() {
    const dispatch = useDispatch();
    const { loading, error, result } = useSelector(store => store.makeRequest);
    const [heading, setHeading] = useState('Here\'s what movies are currently trending');
    const [set, setSet] = useState(1);
    const [column, setColumn] = useState('release_date');

    useEffect(_=> dispatch( makeRequest(`popular`, `?column=${column}&set=${set}`)), [column, set]);

    return (
        <>
            <div style={{ display: 'flex', overflow: 'hidden' }}>
                <div style={{ display: 'flex', height: '100vh', flexDirection: 'column' }}>
                    <Nav />
                    <ul className="sidebar">
                        <li tabIndex="0" onKeyDown={e => e.keyCode === 13 && setColumn('release_date')} className="sidebar-li-hover" key="0" onClick={_=> setColumn('release_date')}>Trending</li>
                        <li tabIndex="0" onKeyDown={e => e.keyCode === 13 && setColumn('release_date')} className="sidebar-li-hover" key="1" onClick={_=> setColumn('release_date')}>Recent Releases</li>
                        <li tabIndex="0" onKeyDown={e => e.keyCode === 13 && setColumn('times_saved_this_month')} className="sidebar-li-hover" key="2" onClick={_=> setColumn('times_saved_this_month')}>Most Saved This Month</li>
                        <li tabIndex="0" onKeyDown={e => e.keyCode === 13 && setColumn('times_saved')} className="sidebar-li-hover" key="3" onClick={_=> setColumn('times_saved')}>Most Saved All Time</li>
                        <li style={{ marginTop: '2.5rem', height: '23px', width: '100%' }}>
                            <div style={{ posiiton: 'relative', display: 'flex', justifyContent: 'space-between', width: '100%', height: '100%' }}>
                                <button className="button-v2" style={{ pointerEvents: 'none', opacity: 0, left: '1rem', transition: 'opacity 550ms ease-in-out' }} onClick={e => {
                                    if (set === 2) {
                                        e.target.style.opacity = 0;
                                        e.target.parentElement.children[1].style.transform = 'translateX(0)';
                                        e.target.style.pointerEvents = 'none';
                                    }
                                    e.target.blur();
                                    setSet(set - 1)
                                }}>Previous</button>
                                <button style={{ left: '1rem', transition: 'transform 550ms ease-in-out' }} className="button-v2" onClick={e => {
                                    if (set === 1) {
                                        e.target.style.transform = 'translateX(calc(190px - 1rem))';
                                        e.target.parentElement.children[0].style.opacity = 1;
                                        e.target.parentElement.children[0].style.pointerEvents = 'auto'
                                    }
                                    e.target.blur();
                                    setSet(set + 1)
                                }}>Next</button>
                            </div>
                        </li>
                    </ul>
                </div>
                
                <div style={{ flex: 4, marginBottom: '2rem' }}>
                    {error && <div>{error}</div>}
                    {loading
                        ? <div>Loading movies...</div>
                        : <MovieList movies={result} heading={heading} headingMargin="4rem" displaying={'Popular'}/>    
                    }
                </div>
            </div>
        </>
    )
}

export default Popular
