import React from 'react';
import DelayLink from './DelayLink';

function Nav({ withBack, searchValue, page, back, scrollY }) {

    return (
        <nav>
            <ul>
                <li><DelayLink to="/">Home</DelayLink></li>
                <li><DelayLink to="/my-list">My List</DelayLink></li>
                <li><DelayLink to="/popular">Popular</DelayLink></li>
                {withBack && <li><DelayLink to={{
                    pathname: back,
                    searchValue,
                    page,
                    scrollY
                }}>Back</DelayLink></li>}
            </ul>
        </nav>
    )
}

export default Nav
