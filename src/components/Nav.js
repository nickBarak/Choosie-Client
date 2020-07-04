import React from 'react';
import { Link } from 'react-router-dom';

function Nav({ withSearch, searchValue }) {
    return (
        <nav>
            <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/my-list">My List</Link></li>
                <li><Link to="/popular">Popular</Link></li>
                {withSearch && <li><Link to={{
                    pathname: "/search",
                    searchValue
                }}>Back to Search</Link></li>}
            </ul>
        </nav>
    )
}

export default Nav
