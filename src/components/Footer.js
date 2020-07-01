import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
    return (
        <>
            <Link to="/help" className="link-help">What is <span className="logo" style={{ fontWeight: 600 }}>Choosie</span>?</Link>
            <div style={{'position': 'absolute', 'bottom': '.85rem', 'right': '1rem', 'color': 'black', 'userSelect': 'none'}}>© 2020 Choosie | Nick Barak</div>
        </>
    )
}

export default Footer
