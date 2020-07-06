import React from 'react';
import DelayLink from './DelayLink';
import { Link } from 'react-router-dom';

function Footer() {
    return (
        <>
            <DelayLink
                delay={2000}
                onDelayStart={_=> document.getElementById('pageContainer').style.opacity = 0} to="/help" className="link-help">What is <span className="logo" style={{ fontWeight: 600 }}>Choosie</span>?</DelayLink>
            <div style={{'position': 'absolute', 'bottom': '.85rem', 'right': '1rem', 'color': 'black', 'userSelect': 'none'}}>© 2020 Choosie | Nick Barak</div>
        </>
    )
}

export default Footer
