import React, { useState } from 'react';
import Nav from './Nav';

const prompts = [
    'Feeling a particular genre?',
    'Want to apply any time constraints',
    'Time periods preferred?'
],
buttonSets = [
    [ ['Action', 'Comedy', 'Drama', 'Thriller'] ],
    [ ['1 hour', '2 hours', '2.5 hours'] ],
    [ ['1970s', '1980s', 'Earlier', 'Any'], ['1990s', '2000s', 'Later'] ]
],
nextButtons = ['Show More', 'None', 'Next'];

function Query(props) {
    const [phase, setPhase] = useState(0);

    function advance(e) {
        // e.preventDefault();
        // do some fetch with e.target.textContent
        setPhase(phase + 1);
    }

    return (
        <>
            <Nav />
            <div className="frame">
                <h2 className="query-prompt">{prompts[phase]}</h2>
                {buttonSets[phase].map((set, i) => <ul key={i}className="button-wrapper">
                    {set.map((button, j) => <li key={j}><button className="button" onClick={advance}>{button}</button></li>)}
                    {i === buttonSets[phase].length - 1 && <li>
                        <button className="button query-next" onClick={advance}>{nextButtons[phase]}</button>
                    </li>}
                </ul>)}
            </div>
        </>
    )
}

export default Query
