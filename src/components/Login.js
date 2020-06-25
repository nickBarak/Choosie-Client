import React, { useState, useContext } from 'react';
import { server } from '../APIs';
// import UserContext from '../store/contexts/User.context';
import HistoryContext from '../store/contexts/History.context';
import { updateUser } from '../store/actions/updateUser.action';
import { useDispatch, useSelector } from 'react-redux';

function Login() {
    const dispatch = useDispatch();
    const user = useSelector(store => store.user.result);
    const history = useContext(HistoryContext);
    // const [user, setUser] = useContext(UserContext);
    const [open, setOpen] = useState(false);
    const [error, setError] = useState(null);

    const onLogin = async e => {
        e.persist();
        e.preventDefault();
        const username = e.target.children[0].value,
            password = e.target.children[2].value;
        if (!username && !password) {
            setOpen(false);
            return;
        }
        try {
            const response = await fetch(server+`users/${username}`),
            json = await response.json();
            if (!json[0]) { setError('Invalid login'); return }
            String(json[0].password) === password ? dispatch( updateUser(username) ) : setError(`Invalid login`);
        } catch (e) { console.log(e) }
    }
    
    function goToRegister(e) {
        e.persist();
        e.preventDefault();
        e.stopPropagation();
        history.push('/register')
    }

    return user
            ? (
                <>
                    <div>Welcome, {user.name || user.username}</div>
                    <button onClick={_=> { dispatch( updateUser(null) ); setOpen(false) }}>Log out</button>
                    <button onClick={_=> history.push(`profile/${user.username}`)}>View profile</button>
                </>
            )
            : open 
                ? (
                    <>
                        {error && <div>{error}</div>}
                        <form onSubmit={onLogin} style={{backgroundColor: 'white', display: 'inline-block'}}>
                            <input type="text" placeholder="username" />
                            <br />
                            <input type="password" placeholder="password" />
                            <br />
                            <button>Log in</button>
                            <button onClick={goToRegister}>Sign up</button>
                        </form>
                    </>
                )
                : <button onClick={_=> setOpen(true)}>Log in</button>
        
}

export default Login
