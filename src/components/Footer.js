import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
    return (
        <>
            <Link to="/help">What is <span style={{'color': 'blue'}}>Choosie</span>?</Link>
            <div style={{'position': 'absolute', 'bottom': '1rem', 'right': '1rem', 'color': 'black', 'userSelect': 'none'}}>© 2020 Choosie | Nick Barak</div>
        </>
    )
}

export default Footer
