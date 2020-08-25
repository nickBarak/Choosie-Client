import React, { useState, useEffect, useRef } from 'react';
import Nav from './Nav';
import MovieList from './MovieList';
import { makeRequest } from '../store/actions/makeRequest.action';
import { useDispatch, useSelector } from 'react-redux';
import { slideDisplayRow } from '../Functions';

let mounted;

function Popular({ location }) {
    const dispatch = useDispatch();
    const { loading, error, result } = useSelector(store => store.makeRequest);
    const [heading, setHeading] = useState('Here\'s what movies are currently trending');
    const [set, setSet] = useState(1);
    const [column, setColumn] = useState('trending');
    const nextButton = useRef(null),
          previousButton = useRef(null);
    !sessionStorage.getItem('popularCache') && sessionStorage.setItem('popularCache', JSON.stringify({
        trending: [[]],
        release_date: [[]],
        times_saved: [[]],
        times_saved_this_month: [[]]
    }));

    useEffect(_=> {
        let cache = JSON.parse(sessionStorage.getItem('popularCache'));
        if (mounted && (!cache[column][set] || !cache[column][set].length)) {
            cache[column].push(result);
            sessionStorage.setItem('popularCache', JSON.stringify(cache));
        }
    }, [result]);

    useEffect(_=> {
        document.getElementById('root').style.opacity = 1;
        mounted = true;
        dispatch( makeRequest(`popular`, `?column=${column === 'trending' ? 'release_date' : column}&set=${set}`, {}, _=> slideDisplayRow(150, false)));
    }, []);

    useEffect(_=> {
        setTimeout(_=> {
            if (1 || (result && result.length < 19)) {
                nextButton.current.style.opacity = 1;
                nextButton.current.style.pointerEvents = 'auto';
            }
        }, 150);
    }, []);

    useEffect(_=> {
        location.searchValue && setColumn(location.searchValue);
        location.page && setSet(location.page);
    }, [])

    useEffect(_=> {
        dispatch( makeRequest(`popular`, `?column=${column === 'trending' ? 'release_date' : column}&set=${set}`, {}, _=> slideDisplayRow(150, false)));
        switch (column) {
            default: break;
            case 'trending':
                setHeading('Here\'s what movies are currently trending');
                break;
            case 'release_date':
                setHeading('Here are the newest movies on record');
                break;
            case 'times_saved_this_month':
                setHeading('Here are the most popular movies this month');
                break;
            case 'times_saved':
                setHeading('Here are the most saved movies to date');
                break;
        }
    }, [column, set]);

    useEffect(_=> {
        (async _=> {
            if (result && (result.length < 20) && nextButton.current) {
                nextButton.current.style.opacity = 0;
                nextButton.current.style.pointerEvents = 'none';
            } else if (result && nextButton.current) {
                nextButton.current.style.opacity = 1;
                nextButton.current.style.pointerEvents = 'auto';
            }
            if (set === 1 && previousButton.current) {
                previousButton.current.style.opacity = 0;
                previousButton.current.style.pointerEvents = 'none';
                nextButton.current.style.transform = 'translateX(0)';
            } else if (previousButton.current) {
                previousButton.current.style.opacity = 1;
                previousButton.current.style.pointerEvents = 'auto';
            }
            if (set === 2)
                nextButton.current.style.transform = 'translate(calc(190px - 1rem))';
        })();
    }, [column]);

    const onClickOrEnter = (e, column) => {
        if (!e || e.keyCode === 13) {
            slideDisplayRow();
            setSet(1);
            setColumn(column);
        }
    }

    return (
        <>
            <div style={{ display: 'flex', overflow: 'hidden' }}>
                <div style={{ display: 'flex', height: '100vh', flexDirection: 'column' }}>
                    <Nav />
                    <ul className="sidebar">
                        <li tabIndex="0" onKeyDown={e => column !== 'trending' && onClickOrEnter(e, 'trending')} className="sidebar-li-hover" key="0" onClick={_=> column !== 'trending' && onClickOrEnter(null, 'trending')}>Trending</li>
                        <li tabIndex="0" onKeyDown={e => column !== 'release_date' && onClickOrEnter(e, 'release_date')} className="sidebar-li-hover" key="1" onClick={_=> column !== 'release_date' && onClickOrEnter(null, 'release_date')}>Recent Releases</li>
                        <li tabIndex="0" onKeyDown={e => column !== 'times_saved_this_month' && onClickOrEnter(e, 'times_saved_this_month')} className="sidebar-li-hover" key="2" onClick={_=> column !== 'times_saved_this_month' && onClickOrEnter(null, 'times_saved_this_month')}>Most Saved This Month</li>
                        <li tabIndex="0" onKeyDown={e => column !== 'times_saved' && onClickOrEnter(e, 'times_saved')} className="sidebar-li-hover" key="3" onClick={_=> column !== 'times_saved' && onClickOrEnter(null, 'times_saved')}>Most Saved All Time</li>
                        <li style={{ marginTop: '2.5rem', height: '23px', width: '100%' }}>
                            <div style={{ posiiton: 'relative', display: 'flex', justifyContent: 'space-between', width: '100%', height: '100%' }}>
                                <button className="button-v2" style={{ pointerEvents: 'none', opacity: 0, left: '1rem', transition: 'opacity 550ms ease-in-out' }} onClick={e => {
                                    if (set === 2) {
                                        e.target.style.opacity = 0;
                                        e.target.parentElement.children[1].style.transform = 'translateX(0)';
                                        e.target.style.pointerEvents = 'none';
                                    }
                                    e.target.blur();
                                    slideDisplayRow();
                                    setSet(set - 1);
                                }} ref={previousButton}>Previous</button>
                                <button style={{ left: '1rem', transition: 'transform 550ms ease-in-out' }} className="button-v2" onClick={e => {
                                    if (set === 1) {
                                        e.target.style.transform = 'translateX(calc(190px - 1rem))';
                                        e.target.parentElement.children[0].style.opacity = 1;
                                        e.target.parentElement.children[0].style.pointerEvents = 'auto'
                                    }
                                    e.target.blur();
                                    slideDisplayRow();
                                    setSet(set + 1);
                                }} ref={nextButton}>Next</button>
                            </div>
                        </li>
                    </ul>
                </div>
                
                <div style={{ flex: 4, marginBottom: '2rem' }}>
                    {<MovieList movies={mounted ? JSON.parse(sessionStorage.getItem('popularCache'))[column][set] ? JSON.parse(sessionStorage.getItem('popularCache'))[column][set] : result : result} heading={error ? 
                    'Error loading movies' : heading} headingMargin="4rem" displaying={'Popular'}
                    locationdetails={{searchValue: column, page: set, back: '/popular'}}/>    
                    }
                </div>
            </div>
        </>
    )
}

export default Popular
