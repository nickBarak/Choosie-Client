import React, { useState, useContext } from 'react';
import { server } from '../APIs';
import { useDispatch } from 'react-redux';
// import UserContext from '../store/contexts/User.context';
import HistoryContext from '../store/contexts/History.context';
import { updateUser } from '../store/actions/updateUser.action';

function Register() {
    const history = useContext(HistoryContext);
    const [continued, setContinued] = useState(false);
    const [info, setInfo] = useState({});
    const [generalError, setGeneralError] = useState(null);
    const [registrationError, setRegistrationError] = useState(null);
    const [loginError, setLoginError] = useState(null);
    // const [, setUser] = useContext(UserContext);
    const dispatch = useDispatch();

    function submitMainInfo(e) {
        setRegistrationError(null);
        e.persist();
        e.preventDefault();
        const children = e.target.children;
        if (children[1].value.match(/some regex/)) { setRegistrationError('Invalid username'); return }
        if (children[3].value !== e.target.children[5].value) { setRegistrationError('Passwords must match'); return }
        if (children[3].value.match(/some regex/)) { setRegistrationError('Invalid password'); return }
        if (0 && 'username exists') { setRegistrationError('Username not available'); return }
        setInfo({
            username: children[1].value,
            password: children[3].value
        });
        setContinued(true);
    }

    function createUser(e) {
        setGeneralError(null);
        setRegistrationError(null);
        e.persist();
        e.preventDefault();
        const children = e.target.children;
        if (!Number.isInteger(Number(children[3].value))) { setRegistrationError('Age must be a whole number'); return }
        if (Number(children[3].value) < 0) { setRegistrationError('You\'re not that young'); return }
        if (Number(children[3].value) > 125) { setRegistrationError('You\'re not that old'); return }
        if (0 && 'email is not a real email') { setRegistrationError('Invalid email address'); return }
        const radioDiv = children[5].children;
        const sex = [radioDiv[3], radioDiv[5], radioDiv[7]].reduce((acc, cur) => cur.checked ? cur.value : acc, null)
        fetch(server + 'users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ...info,
                name: children[1].value ? children[1].value : null,
                age: children[3].value ? Number(children[3].value) : null,
                sex: sex === 'other' ? null : sex,
                languages: [children[6].options[children[6].selectedIndex].text],
                email: children[8].value ? children[8].value : null
            })
        })
            .then(res => res.json())
            .then(json => {
                dispatch( updateUser(json.username) );
                history.push('/');
            })
            .catch(e => setGeneralError('Something went wrong'));
    }

    async function onLogin(e) {
        setGeneralError(null);
        setLoginError(null);
        e.persist();
        e.preventDefault();
        const username = e.target.children[1].value,
            password = e.target.children[3].value;
        if (!username && !password) return;
        try {
            const response = await fetch(server+`users/${username}`),
            json = await response.json();
            if (!json[0]) { setLoginError('Invalid login'); return }
            if (String(json[0].password) === password) {
                dispatch( updateUser(json[0].username) );
                history.push('/');
            } else setLoginError(`Invalid login`);
        } catch (e) { setGeneralError('Something went wrong') }
    }

    return !continued
        ? (
        <div className="container" style={{ flexDirection: 'column' }}>
            {registrationError && <div style={{color: 'red'}}>{registrationError}</div>}
            <form className="register-1" onSubmit={submitMainInfo}>
                <div className="prompt-register">Please enter a username and password or sign in with another platform</div>
                <input className="input-register" type="text" placeholder="username" key="username" />
                <br />
                <input className="input-register" type="password" placeholder="password" key="password" />
                <br />
                <input className="input-register" type="password" placeholder="repeat password" />
                <br />
                <div>
                    <button className="button-register">Continue</button>
                    <button onClick={_=> history.push('/')} className="button-register">Cancel</button>
                </div>
            </form>
            {loginError
                ? <div style={{color: 'red'}}>{loginError}</div>
                : generalError && <div style={{ color: 'maroon' }}>{generalError}</div>
            }
            <form className="register-1" onSubmit={onLogin}>
                <div className="prompt-register">Already have an account? Log in</div>
                <input className="input-register" type="text" placeholder="username" />
                <br />
                <input className="input-register" type="password" placeholder="password" />
                <br />
                <button className="button-register">Log in</button>
            </form>
        </div>)
        : <div className="container" style={{ flexDirection: 'column' }}>
            {registrationError
                ? <div style={{color: 'red'}}>{registrationError}</div>
                : generalError && <div style={{ color: 'maroon' }}>{generalError}</div>
            }
            <form className="register-1" onSubmit={createUser}>
                <div className="prompt-register">You can enter more information here for a better experience</div>
                <input className="input-register" type="text" placeholder="first name" key="name" />
                <br />
                <input className="input-register" type="text" placeholder="age" key="age" />
                <br />
                <div>
                    <label>sex: </label>
                    <br />
                    <label>female</label><input type="radio" name="sex" value="female" />
                    <label> male</label><input type="radio" name="sex" value="male" />
                    <label> other</label><input type="radio" name="sex" value="other" defaultChecked />
                </div>
                <select defaultValue="default">
                    {['English', 'Spanish', 'French', 'Mandarin', 'Cantonese', 'Hindi', 'German', 'Italian', 'Dutch', 'Portuguese', 'Russian', 'Standard Arabic', 'Punjabi', 'Bengali', 'Polish', 'Czech', 'Ukranian', 'Indonesian', 'Japanese', 'Swahili', 'Telugu', 'Tamil', 'Turkish','Korean', 'Hungarian', 'Thai', 'Vietnamese', 'Sundanese', 'Filipino', 'Tagalog', 'Malay', 'Burmese', 'Romanian', 'Swedish', 'Afrikaans'].map((language, i) => i === 0 ? <option key={i} value="default">{language}</option> : <option key={i} >{language}</option>)}
                </select>
                <br />
                <input className="input-register" type="text" placeholder="email" />
                <br />
                <div className="prompt-register" style={{ margin: '.5rem' }}>You can also edit these fields later</div>
                <div>
                    <button className="button-register" >Sign up</button>
                    <button className="button-register" onClick={_=> history.push('/')}>Cancel</button>
                </div>
            </form>
    </div>
}

export default Register
