import React, { useState } from 'react';
import { server } from '../APIs';
import { useSelector } from 'react-redux';

function StarRater() {
    const user = useSelector(store => store.user.result);
    const [starRating, setStarRating] = useState(0);

    function rate(rating) {
        setStarRating(rating);
        try {
            fetch(server + 'search', {
                mode: 'cors',
                method: 'POST',
                headers: { 'Content-Type': 'application/json'/*, 'Accept': 'application/json' */ },
                body: JSON.stringify({ rating, username: user ? user.username : null })
            })
        } catch (e) { console.log(e) }
    }

    return (
        <div className="star-rater">
            <label style={{ marginRight: '.5rem' }}>How would you rate these suggestions?</label>
            <span>
                {[1,2,3,4,5].map(el => starRating >= el
                    ? <i key={el} className="fas fa-star" onClick={_=> rate(el)} style={{ cursor: 'pointer' }} />
                    : <i key={el} className="far fa-star" onClick={_=> rate(el)} style={{ cursor: 'pointer' }} />
                )}
            </span>
        </div>
    )
}

export default StarRater
