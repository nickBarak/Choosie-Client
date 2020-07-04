import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Nav from './Nav';
import MovieList from './MovieList';
import { makeRequest } from '../store/actions/makeRequest.action';
import StarRater from './StarRater';
import { query } from '../store/actions/query.action';

class QueryContent {
    constructor(prompt, buttonSet, nextButton) {
        this.prompt = prompt;
        this.buttonSet = [ ...buttonSet];
        this.nextButton = nextButton;
    }
}

const phases = [
    new QueryContent('Feeling a particular genre?', [ ['Action', 'Comedy', 'Drama', 'Thriller'] ], 'Show More'),
    new QueryContent('You can select more than one if you want', [ ['Romance', 'Sci-Fi', 'Fantasy', 'Family', ''], ['Cyber', 'Medieval', 'Documentary', 'Tragedy'], ['Action', 'Comedy', 'Drama', 'Thriller'] ], 'Next'),
    new QueryContent('Want to apply any time constraints?', [ ['1 hour', '2 hours', '2.5 hours'] ], 'None'),
    new QueryContent('Time periods preferred?', [ ['1970s', '1980s', 'Earlier', 'Any'], ['1990s', '2000s', 'Later'] ], 'Next')
]

function Query(props) {
    const [phase, setPhase] = useState(0);
    const { prompt, buttonSet, nextButton } = phase < 4 && phases[phase];
    const answers = useRef([[]]);
    const { loading, error, result } = useSelector(store => store.makeRequest);
    const [set, setSet] = useState(1);
    const dispatch = useDispatch();

    useEffect(_=> dispatch( query('...') ), [set]);

    function advance(e) {
        e.preventDefault();
        answers.current[phase !== 1 ? phase : phase - 1] =
            phase < 2
                ? phase === 0
                    ? [ ...answers.current[phase], e.target.textContent ]
                    : [ ...answers.current[phase-1], e.target.textContent ]
                : e.target.textContent;
        setPhase(phase + 1);
    }

    return (
        <>
            <Nav />
            
            {phase < 4
                ? 
                <div className="container" style={{ position: 'absolute', zIndex: '-1', height: '100vh', top: 0 }}>
                    <div className="frame">
                        <h2 className="query-prompt">{prompt}</h2>
                        {buttonSet.map((set, i) => <ul key={i}className="button-wrapper">
                            {set.map((button, j) => <li key={j}><button className="button" onClick={advance} style={button ? {} : { visibility: 'hidden' }}>{button}</button></li>)}
                            {i === buttonSet.length - 1 && <li>
                                <button className="button query-next" onClick={advance}>{nextButton}</button>
                            </li>}
                        </ul>)}
                    </div>
                </div>
                : <>
                    <MovieList movies={result || []} heading="Here are some movies you might be interested in" displaying="Query" lowerMargin="4rem" headingMargin="3.5rem"/>
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
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '8rem' }}>
                        <StarRater />
                    </div>
                </>}
        </>
    )
}

export default Query
