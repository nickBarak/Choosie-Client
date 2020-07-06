import React from 'react';
import { Link } from 'react-router-dom';
import DelayLink from './DelayLink';

function Nav({ withBack, searchValue, page, back }) {
    return (
        <nav>
            <ul>
                <li><DelayLink to="/">Home</DelayLink></li>
                <li><DelayLink to="/my-list">My List</DelayLink></li>
                <li><DelayLink to="/popular">Popular</DelayLink></li>
                {withBack && <li><DelayLink to={{
                    pathname: "/search",
                    searchValue,
                    page,
                }}>Back to {back}</DelayLink></li>}
            </ul>
        </nav>
    )
}

export default Nav
