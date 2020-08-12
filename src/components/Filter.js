import React, { useState, useReducer } from 'react';

const ageRatings = ['G', 'PG', 'PG-13', 'TV-14', 'R/TV-MA', 'NR'],
      durations = ['30min', '1h', '1h 30min', '2h', '2h 30min', '3h'],
      genres = ['Action', 'Comedy', 'Drama', 'Thriller', 'Family', 'Fantasy', 'Animation'],
    //   saveDates = ['2 days ago', '1 week ago', '2 weeks ago', '3 weeks ago', '1 month ago', '2 months ago', '3 months ago', '6 months ago', '1 year ago'],
      releaseDates = ['1920', '1930', '1940', '1950', '1960', '1970', '1980', '1990', '2000', '2010', '2020'],
      filterOptionsInit = [ [ [ 'init', 'init', 'higher' ], [ ...ageRatings ] ] ];

function Filter({ displayList, dispatchDisplayList }) {
    const [filterOptions, dispatchFilterOptions] = useReducer(filterOptionsReducer, JSON.parse( JSON.stringify(filterOptionsInit) ));
    const [filterID, setFilterID] = useState(0);

    const makeFilter = id => (
        <span>
            <select defaultValue={filterOptions[id][0][0]}
                onChange={e => {
                    dispatchFilterOptions({
                    type: e.target.options[e.target.selectedIndex].text,
                    payload: { id, select: 0 }
                });
                dispatchFilterOptions({
                    type: "init",
                    payload: { id, select: 1 }
                });
                if (e.target.parentElement.children.length > 1) {
                    e.target.parentElement.children[1].selectedIndex = 0;
                    e.target.parentElement.children[2].children[0].children[0].checked = true;
                }
            }}>
                <option key="-1" value="init" disabled>Select an option</option>
                <option key="0" value="Age Rating">Age Rating</option>
                <option key="1" value="Duration">Duration</option>
                <option key="2" value="Genre">Genre</option>
                {/* <option key="3" value="Date Saved">Date Saved</option> */}
                <option key="4" value="Release Date">Release Date</option>
            </select>
            {filterOptions[id][0][0] !== 'init' && (
            <>
                <select style={{ marginLeft: '.35rem' }} defaultValue={filterOptions[id][0][1]}
                    onChange={e => {
                        dispatchFilterOptions({
                        type: e.target.options[e.target.selectedIndex].text,
                        payload: { id, select: 1 }
                    });
                    dispatchDisplayList( deriveFilterValues(e.target.parentElement.parentElement.parentElement) );
                }}>
                    <option key="-1" value="init" disabled>Select an option</option>
                    {filterOptions[id][1].map((option, i) => <option key={i} value={option}>{option}</option>)}
                </select>
                <span>
                    <label style={{ marginLeft: '.35rem' }}><input style={{ margin: '.5' }} type="radio" name={`filterByRadio_${id}`} value="higher" defaultChecked={filterOptions[id][0][2] === 'higher' ? true : false} onChange={e => {
                        dispatchFilterOptions({ type: 'higher', payload: { id, select: 2 }});
                        dispatchDisplayList( deriveFilterValues(e.target.parentElement.parentElement.parentElement.parentElement.parentElement) );
                    }} />higher/later</label>
                    <label style={{ marginLeft: '.35rem' }}><input style={{ margin: '.5' }} type="radio" name={`filterByRadio_${id}`} value="lower" defaultChecked={filterOptions[id][0][2] === 'lower' ? true : false} onChange={e => {
                        dispatchFilterOptions({ type: 'lower', payload: { id, select: 2 }});
                        dispatchDisplayList( deriveFilterValues(e.target.parentElement.parentElement.parentElement.parentElement.parentElement) );
                    }} />lower/earlier</label>
                    <label style={{ marginLeft: '.35rem' }}><input style={{ margin: '.5' }} type="radio" name={`filterByRadio_${id}`} value="exact" defaultChecked={filterOptions[id][0][2] === 'exact' ? true : false} onChange={e => {
                        dispatchFilterOptions({ type: 'exact', payload: { id, select: 2 }});
                        dispatchDisplayList( deriveFilterValues(e.target.parentElement.parentElement.parentElement.parentElement.parentElement) );
                    }} />exact</label>
                </span>
            </>
            )}
        </span>
    );

    function filterOptionsReducer(state, { type, payload }) {
        let newState = [ ...state ];
        if (type === 'Clear Filters') return JSON.parse( JSON.stringify(filterOptionsInit) );
        if (type !== 'New Filter') newState[payload.id][0].splice(payload.select, 1, type);

        switch (type) {
            default: break;
            case 'Age Rating':
                newState[payload.id][1].splice(0, state[payload.id][1].length, ...ageRatings);
                break;
            case 'Duration':
                newState[payload.id][1].splice(0, state[payload.id][1].length, ...durations);
                break;
            case 'Genre':
                newState[payload.id][1].splice(0, state[payload.id][1].length, ...genres);
                break;
            // case 'Date Saved':
            //     newState[payload.id][1].splice(0, state[payload.id][1].length, ...saveDates);
            //     break;
            case 'Release Date':
                newState[payload.id][1].splice(0, state[payload.id][1].length, ...releaseDates);
                break;
            case 'New Filter':
                newState.push(JSON.parse( JSON.stringify(filterOptionsInit[0]) ));
                break;
        }
        return newState;
    }

    const deriveFilterValues = ul => Array.from(ul.children, li => {
        const children = li.children[0].children;
        if (!children[1]) return null;
        const type = children[0].options[children[0].selectedIndex].text,
            payload = {
                value: children[1].options[children[1].selectedIndex].text,
                range: Array.from(children[2].children).find(child => child.children[0].checked).children[0].value
            };
        return ({ type, payload });
    }).filter(filter => filter);

    return (
        <form className="filter" onSubmit={e => {
            e.persist();
            e.preventDefault();
            dispatchFilterOptions({ type: 'Clear Filters' });
            dispatchDisplayList(null);
            setFilterID(0);
            e.target.reset();
        }} style={{ marginBottom: '2rem' }}>
            <label>Filter by: </label>
            <ul style={{ margin: '.7rem 1.5rem' }}>
                <li key="0">
                    {makeFilter(0)}
                    {filterID === 0 && filterOptions[0][0][0] !== 'init' && <button className="button-filter" type="button" onClick={e => {
                        dispatchFilterOptions({ type: 'New Filter' });
                        setFilterID(filterID + 1);
                    }}>+</button>}
                </li>
                {filterID > 1 && new Array(filterID-1).fill(null).map((filter, i) => <li key={i+1}>{makeFilter(i+1)}</li>)}
                {filterID > 0 &&
                    <li key={filterID}>
                        {makeFilter(filterID)}
                        {filterOptions[filterID][0][0] !== 'init' && <button className="button-filter" type="button" onClick={e => {
                            dispatchFilterOptions({ type: 'New Filter' });
                            setFilterID(filterID + 1);
                        }}> + </button>}
                    </li>
                }
            </ul>
            <button style={{ backgroundColor: 'transparent', border: 'none', color: 'white' }} onMouseOver={e => {
                e.target.style.color = 'red';
                e.target.style.cursor = 'pointer';
            }} onMouseOut={e => e.target.style.color = 'white'}>Reset</button>
        </form>
    )
}

export default Filter
