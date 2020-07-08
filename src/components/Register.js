import React, { useState, useContext, useEffect } from 'react';
import { server } from '../APIs';
import { useDispatch } from 'react-redux';
// import UserContext from '../store/contexts/User.context';
import HistoryContext from '../store/contexts/History.context';
import { updateUser } from '../store/actions/updateUser.action';
import { transitionPage } from '../Functions';

const languageOptions = [
    'Afrikaans',       'Bengali',    'Burmese',
    'Cantonese',       'Czech',      'Dutch',
    'English',         'Filipino',   'French',
    'German',          'Hindi',      'Hungarian',
    'Indonesian',      'Italian',    'Japanese',
    'Korean',          'Malay',      'Mandarin',
    'Polish',          'Portuguese', 'Punjabi',
    'Romanian',        'Russian',    'Spanish',
    'Standard Arabic', 'Sundanese',  'Swahili',
    'Swedish',         'Tagalog',    'Tamil',
    'Telugu',          'Thai',       'Turkish',
    'Ukranian',        'Vietnamese'
  ];

function Register() {
    const history = useContext(HistoryContext);
    const [continued, setContinued] = useState(false);
    const [info, setInfo] = useState({});
    const [generalError, setGeneralError] = useState(null);
    const [registrationError, setRegistrationError] = useState(null);
    const [loginError, setLoginError] = useState(null);
    const dispatch = useDispatch();

    useEffect(_=> { document.getElementById('root').style.opacity = 1 }, []
    );

    function submitMainInfo(e) {
        setRegistrationError(null);
        e.persist();
        e.preventDefault();
        const children = e.target.children[1].children;
        if (children[0].children[0].value.includes(' ')) { setRegistrationError('Username cannot contain a space'); return }
        if (!/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/.exec(children[1].children[0].value)) { setRegistrationError('Password must be at least 8 characters with one of each of the following: upper case letter, lower case letter, number and special character'); return }
        if (children[1].children[0].value !== children[2].children[0].value) { setRegistrationError('Passwords must match'); return }
        (async _=> {
            const response = await fetch(server + 'users/check?user=' + children[0].children[0].value);
            const json = await response.json();
            if (json.length) {
                setRegistrationError('Username not available');
                return;
            }
            setInfo({
                username: children[0].children[0].value,
                password: children[1].children[0].value
            });
            setContinued(true);
            e.target.reset();
        })();
    }

    function createUser(e) {
        setGeneralError(null);
        setRegistrationError(null);
        e.persist();
        e.preventDefault();
        const children = e.target.children[1].children;
        if (children[2].children[0].value && !/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.exec(children[2].children[0].value)) { setRegistrationError('Invalid email address'); return }
        fetch(server + 'users', {
            mode: 'cors',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ...info,
                name: children[0].children[0].value ? children[0].children[0].value : null,
                age: children[1].children[0].selectedIndex ? Number(children[1].children[0].options[children[1].children[0].selectedIndex].text) : 0,
                sex: children[1].children[1].selectedIndex ? children[1].children[1].options[children[1].children[1].selectedIndex].text : null,
                languages: children[1].children[2].selectedIndex ? [children[1].children[2].options[children[1].children[2].selectedIndex].text] : null,
                email: children[2].children[0].value ? children[2].children[0].value : null
            })
        })
            .then(res => res.json())
            .then(json => {
                dispatch( updateUser(json.username) );
                transitionPage(history, '/');
            })
            .catch(e => setGeneralError('Something went wrong'));
        e.target.reset();
    }

    async function onLogin(e) {
        setGeneralError(null);
        setLoginError(null);
        e.persist();
        e.preventDefault();
        const username = e.target.children[1].children[0].children[0].value,
            password = e.target.children[1].children[1].children[0].value;
        if (!username && !password) return;
        try {
            const response = await fetch(server+`users/${username}`),
            json = await response.json();
            if (!json[0]) { setLoginError('Invalid login'); return }
            if (String(json[0].password) === password) {
                dispatch( updateUser(json[0].username) );
                transitionPage(history, '/');
            } else setLoginError(`Invalid login`);
        } catch (e) { setGeneralError('Something went wrong') }
        e.target.reset();
    }

    return !continued
        ? (
        <div className="container" style={{ flexDirection: 'column' }}>
            {registrationError && <div style={{color: 'red', margin: '1rem' }}>{registrationError}</div>}
            <form className="register-1" onSubmit={submitMainInfo}>
                <div className="prompt-register">Please enter a username and password</div>
                <ul style={{ display: 'flex', flexDirection: 'column', width: '80%', placeItems: 'center' }}>
                    <li style={{ margin: '.25rem', width: '100%', maxWidth: '25rem' }}>
                        <input className="input-register" type="text" placeholder="username" key="username" />
                    </li>
                    <li style={{ margin: '.25rem', width: '100%', maxWidth: '25rem' }}>
                        <input className="input-register" type="password" placeholder="password" key="password" />
                    </li>
                    <li style={{ margin: '.25rem', width: '100%', maxWidth: '25rem' }}>
                        <input className="input-register" type="password" placeholder="repeat password" />
                    </li>
                </ul>
                <div>
                    <button className="button-register">Continue</button>
                    <button type="button" onClick={_=> transitionPage(history, '/')} className="button-register">Cancel</button>
                </div>
            </form>
            {loginError
                ? <div style={{color: 'red', margin: '1rem' }}>{loginError}</div>
                : generalError && <div style={{ color: 'maroon' }}>{generalError}</div>
            }
            <form className="register-1" onSubmit={onLogin}>
                <div className="prompt-register">Already have an account? Log in</div>
                <ul style={{ display: 'flex', flexDirection: 'column', width: '80%', placeItems: 'center' }}>
                    <li style={{ margin: '.25rem', width: '100%', maxWidth: '25rem' }}>
                        <input className="input-register" type="text" placeholder="username" />
                    </li>
                    <li style={{ margin: '.25rem', width: '100%', maxWidth: '25rem' }}>
                        <input className="input-register" type="password" placeholder="password" />
                    </li>
                </ul>
                <button className="button-register">Log in</button>
            </form>
        </div>)
        : <div className="container" style={{ flexDirection: 'column' }}>
            {registrationError
                ? <div style={{color: 'red', margin: '1rem'}}>{registrationError}</div>
                : generalError && <div style={{ color: 'maroon' }}>{generalError}</div>
            }
            <form className="register-1" onSubmit={createUser}>
                <div className="prompt-register">You can enter more information here for a better experience</div>
                <ul>
                    <li style={{margin: '.75rem' }}>
                        <input className="input-register" type="text" placeholder="first name" key="name" />
                    </li>
                    <li  style={{margin: '.75rem' }}className="ul-create-user">
                        <select defaultValue="default">
                            <option key="-1" value="default" disabled>Select an age</option>
                            {new Array(126).fill('').map((el, i) => <option key={i}>{i}</option>)}
                        </select>
                        <select defaultValue="default">
                            <option key="0" value="default" disabled>Select a sex</option>
                            <option key="1" value="female">Female</option>
                            <option key="2" value="male">Male</option>
                            <option key="3" value="other">Other</option>
                        </select>
                        <select defaultValue="default">
                            <option key="-1" value="default" disabled>Select a language</option>
                            {languageOptions.map((language, i) => <option key={i} >{language}</option>)}
                        </select>
                    </li>
                    <li style={{margin: '.75rem' }}>
                        <input className="input-register" type="text" placeholder="email" />
                    </li>
                </ul>
                <div className="prompt-register" style={{ marginTop: '.5rem', marginBottom: '.3rem' }}>You can also edit these fields later</div>
                <div>
                    <button className="button-register" >Sign up</button>
                    <button type="button" className="button-register" onClick={_=> transitionPage(history, '/')}>Cancel</button>
                </div>
            </form>
    </div>
}

export default Register
