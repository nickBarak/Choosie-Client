import React, { useContext } from 'react';
import { useDispatch } from 'react-redux';
import Login from './Login';
import Footer from './Footer';
import { search } from '../store/actions/search.action';
import UserContext from '../store/contexts/User.context';
import HistoryContext from '../store/contexts/History.context';
import { server } from '../APIs';

function Home() {
    const dispatch = useDispatch();
    const history = useContext(HistoryContext);
    const [user] = useContext(UserContext);

    const onSearch = async e => {
        e.persist();
        e.preventDefault();
        try { 
            dispatch( search(user ? user.username : null, e.target.children[0].value, 1) );
            e.target.reset();
            history.push('/search')
        } catch (e) { console.log(e) }
    }

    function onClick(button, route) {
        user && fetch(`${server}home/${user.username}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ button })
        })
            .then(res => !res.ok && console.log('Something went wrong'))
            .catch(e => console.log(e));
        history.push(route);
    }
    
    return (
        <>
            <Login history={history} />
            <div className="container">
                <div className="frame">
                    <h1 className="logo" style={{ userSelect: 'none', fontSize: 45}}>Choosie</h1>
                    <form onSubmit={onSearch}>
                        <input className="search" type="text" placeholder="Search actors, genres, directors" style={{ margin: '1.5rem 1.5rem'}} />
                    </form>
                    <ul className="button-wrapper">
                        <li><button className="button" onClick={_=> onClick('my_list', '/my-list')}>My List</button></li>
                        <li><button className="button" onClick={_=> onClick('start', '/query')}>Start</button></li>
                        <li><button className="button" onClick={_=> onClick('popular', '/popular')}>Popular</button></li>
                    </ul>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default Home
