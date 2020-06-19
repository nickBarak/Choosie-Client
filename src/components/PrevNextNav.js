import React, { useContext } from 'react';
import HistoryContext from '../store/contexts/History.context';

function PrevNextNav({ callback, link }) {
    const history = useContext(HistoryContext);

    return (
        <div>
            <button onClick={_=> history.push('/')}>Back to Home</button>
            <button onClick={_=> { callback && callback(); history.push(link.url) }}>{link.prompt}</button>
        </div>
    )
}

export default PrevNextNav
