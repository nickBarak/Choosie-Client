import React, { useState, useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
// import UserContext from '../store/contexts/User.context';
import { makeRequest } from '../store/actions/makeRequest.action';
import HistoryContext from '../store/contexts/History.context';
import { updateUser } from '../store/actions/updateUser.action';
import Toggler from './Toggler';

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

let mounted;

function Profile() {
    // const [user, setUser] = useContext(UserContext);
    const [editInfoError, setEditInfoError] = useState(null);
    const [editingInfo, setEditingInfo] = useState(false);
    const [changingPassword, setChangingPassword] = useState(false);
    const [changePasswordError, setChangePasswordError] = useState(null);
    const location = useLocation();
    const history = useContext(HistoryContext);
    const dispatch = useDispatch();
    const { error, result, loading } = useSelector(store => store.makeRequest);
    const user = useSelector(store => store.user.result);
    const [clearing, setClearing] = useState(false);
    const [showSaveHistory, setShowSaveHistory] = useState(user && user.show_save_history);
    const [showDescriptionOnHover, setShowDescriptionOnHover] = useState(user && user.show_description_on_hover);
    const [message, setMessage] = useState(null);

    function editInfo(e, signal) {
        if (e) {
            e.persist();
            e.preventDefault();
            if (e.target.children[5].value && !/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.exec(e.target.children[5].value)) { setEditInfoError('Invalid email address'); return }
        }
        const children = e && e.target.children,
              editedInfo = {
                name: e ? children[0].value : user.name,
                sex: e ? children[1].children[0].selectedIndex ? children[1].children[0].options[children[1].children[0].selectedIndex].text : user.sex : user.sex,
                age: e ? children[1].children[1].selectedIndex ? Number(children[1].children[1].options[children[1].children[1].selectedIndex].text) : user.age : user.age,
                languages: e ? children[1].children[2].selectedIndex ? [children[1].children[2].options[children[1].children[2].selectedIndex].text] : user.languages : user.languages,
                country: e ? children[4].value : user.country,
                email: e ? children[5].value : user.email,
                show_save_history: showSaveHistory,
                show_description_on_hover: showDescriptionOnHover,
                recent_save_history: clearing ? [] : user.recent_save_history
        };
        new Promise(resolve => dispatch( makeRequest(`users/${user.username}`, '', {
            signal,
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(editedInfo)
        }) ) || resolve())
            .then(_=> {
                dispatch( updateUser(user.username) );
            });
    }

    useEffect(_=> {
        if (!mounted) { mounted = true; return }
        const controller = new AbortController(),
              { signal } = controller;
        editInfo(null, signal);
        return _=> controller.abort();
    }, [clearing, showSaveHistory, showDescriptionOnHover]);

    useEffect(_=> {

    }, [editingInfo]);

    function changePassword(e) {
        e.persist();
        e.preventDefault();
        setChangePasswordError(null);
        const children = e.target.children,
              currentPassword = children[0].value,
              newPassword = children[1].value,
              repeatedNewPassword = children[2].value;
        if (currentPassword !== user.password) { setChangePasswordError('Entry for current password was incorrect'); return }
        if (!/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/.exec(newPassword)) { setChangePasswordError('Password must be at least 8 characters with one of each of the following: upper case letter, lower case letter, number and special character'); return }
        if (newPassword !== repeatedNewPassword) { setChangePasswordError('Passwords must match'); return }
        (async _=> {
            await dispatch( makeRequest(`users/${user.username}`, null, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    currentPassword,
                    newPassword
                })
            }) );
            if (error) {
                setChangePasswordError('Error changing password');
            } else {
                dispatch( updateUser(user.username) );
                e.target.style.transform = 'scale(0)';
                e.target.style.maxHeight = 0;
                e.target.parentElement.parentElement.parentElement.parentElement.children[0].style.transform =
                    e.target.parentElement.parentElement.parentElement.children[0].children[0].children[2].style.maxHeight === '100%'
                        ? 'translate(6rem, 3.5rem)'
                        : 'translate(-6rem, 2rem)';
                e.target.reset();
                setMessage('Password changed successfully');
            }
        })();
    }

    function clearInfo(type) {
        switch (type) {
            case 'name':
                break;
            case 'sex':
                break;
            case 'age':
                break;
            case 'languages':
                break;
            case 'country':
                break;
            case 'email':
                break;
            default: break;
        }
    }

    return (
        user && user.username === location.pathname.split('/profile/')[1]
        ? <div className="container" style={{ flexDirection: 'column' }}>
            <div className="register-1" style={{ transition: 'transform 300ms ease-out'}}>
                <label className="prompt-register">Your info</label>
                <ul className="info-list">
                    <li>
                        <button onClick={clearInfo('name')}>Clear</button>
                        <label>Name: </label>
                        <span>{user.name || 'Not specified'}</span>
                    </li>
                    <li>
                        <label>Username: </label>
                        <span>{user.username}</span>
                    </li>
                    <li>
                        <button onClick={clearInfo('sex')}>Clear</button>
                        <label>Sex: </label>
                        <span>{user.sex || 'Not specified'}</span>
                    </li>
                    <li>
                        <button onClick={clearInfo('age')}>Clear</button>
                        <label>Age: </label>
                        <span>{user.age || 'Not specified'}</span>
                    </li>
                    <li>
                        <button onClick={clearInfo('languages')}>Clear</button>
                        <label>Languages: </label>
                        <span style={{ whiteSpace: 'normal' }}>{user.languages[0].length ? user.languages : 'Not specified'}</span>
                    </li>
                    <li>
                        <button onClick={clearInfo('country')}>Clear</button>
                        <label>Country: </label>
                        <span>{user.country || 'Not specified'}</span>
                    </li>
                    <li>
                        <button onClick={clearInfo('email')}>Clear</button>
                        <label>Email: </label>
                        <span>{user.email || 'Not specified'}</span>
                    </li>
                </ul>
            </div>
            <ul className="profile-lower">
                <li>
                    <div style={{ padding: '1rem' }} className="register-1">
                        <button className="button-register" onClick={e => {
                            e.target.blur();
                            let { style } = e.target.parentElement.children[2],
                            otherOpen = e.target.parentElement.parentElement.parentElement.children[2].children[0].children[2].style.maxHeight === '100%';
                            style.maxHeight =
                            style.maxWidth =
                                style.maxHeight === '100%' ? 0 : '100%';
                                style.transform =
                                    style.transform === 'scale(0)'
                                        ? 'scale(1)'
                                        : 'scale(0)';
                                e.target.parentElement.parentElement.parentElement.parentElement.children[0].style.transform =
                                    style.maxHeight === '100%'
                                    ? otherOpen
                                        ? 'translate(6rem, 3rem)'
                                        : 'translate(6rem, 5rem)'
                                    : otherOpen
                                        ? 'translate(-6.5rem, 2rem)'
                                        : 'translate(0)';
                        }}>Edit Info</button>
                        <div className="error-msg" style={{ color: 'maroon' }}>{editInfoError}</div>
                        <form onSubmit={editInfo} style={{ transform: 'scale(0)' }}>
                            <input style={{ width: '92.5%', margin: '.35rem' }} className="input-register" placeholder="name" />
                            <div style={{ margin: '.75rem' }} className="ul-create-user">
                                <select style={{ margin: '.35rem' }} defaultValue="default">
                                    <option key="0" value="default" disabled>Select a sex</option>
                                    <option key="1" value="female">Female</option>
                                    <option key="2" value="male">Male</option>
                                    <option key="3" value="other">Other</option>
                                </select>
                                <select style={{ margin: '.35rem' }} defaultValue="default">
                                    <option key="-1" value="default" disabled>Select an age</option>
                                    {new Array(126).fill('').map((el, i) => <option key={i}>{i}</option>)}
                                </select>
                                <select style={{ margin: '.35rem' }} defaultValue="default">
                                    <option key="-1" value="default" disabled>Select a language</option>
                                    {languageOptions.map((lang, i) => <option key={i}>{lang}</option>)}
                                </select>
                            </div>
                            <input style={{ width: '92.5%', margin: '.35rem' }} className="input-register" placeholder="country" />
                            <input style={{ width: '92.5%', margin: '.35rem' }} className="input-register" placeholder="email" />
                            <button className="button-register">Submit</button>
                        </form>
                    </div>
                </li>
                <li>
                    <div style={{ padding: '1rem', fontSize: '1rem', width: '90%' }} className="register-1">
                        <Toggler prompt="Show description on hover?" defaultChecked={showDescriptionOnHover} onCheck={_=> setShowDescriptionOnHover(true)} onUncheck={_=> setShowDescriptionOnHover(false)} />
                        <Toggler className="toggler-profile" prompt="Show Save History?" defaultChecked={showSaveHistory} onCheck={_=> setShowSaveHistory(true)} onUncheck={_=> setShowSaveHistory(false)} />
                        <button className="button-register" onClick={e => {
                            e.target.blur();
                            user.recent_save_history.length && setClearing(true);
                        }}>
                            {user.recent_save_history.length
                                ? clearing
                                    ? 'Clearing...'
                                    : 'Clear Save History'
                                : 'History Cleared'
                            }
                        </button>
                    </div>
                </li>
                <li>
                    <div style={{ padding: '1rem'}} className="register-1">
                        <button className="button-register" onClick={e => {
                            e.target.blur();
                            let { style } = e.target.parentElement.children[2],
                            otherOpen = e.target.parentElement.parentElement.parentElement.children[0].children[0].children[2].style.maxHeight === '100%';;
                            style.maxHeight =
                            style.maxWidth =
                                style.maxHeight === '100%' ? 0 : '100%';
                                style.transform =
                                    style.transform === 'scale(0)'
                                        ? 'scale(1)'
                                        : 'scale(0)';
                            e.target.parentElement.parentElement.parentElement.parentElement.children[0].style.transform =
                                style.maxHeight === '100%'
                                    ? otherOpen
                                        ? 'translate(6rem, 3.5rem)'
                                        : 'translate(-6rem, 2rem)'
                                    : otherOpen
                                        ? 'translate(6rem, 5rem)'
                                        : 'translate(0)';
                        }}>Change Password</button>
                        <div className="error-msg" style={{ color: 'maroon' }}>{changePasswordError}</div>
                        <form onSubmit={changePassword} style={{ transform: 'scale(0)' }}>
                            <input style={{ width: '92.5%' }} className="input-register" type="password" placeholder="Enter current password" />
                            <input style={{ width: '92.5%' }} className="input-register" type="password" placeholder="Enter new password" />
                            <input style={{ width: '92.5%' }} className="input-register" type="password" placeholder="Repeat new password" />
                            <button className="button-register">Submit</button>
                        </form>
                    </div>
                </li>
            </ul>
            {message && <div style={{ color: 'white', margin: '.8rem' }}>{message}</div>}
            <button style={{ margin: '1rem', backgroundColor: 'var(--bg-color-dark)', color: 'var(--color-offset)' }} onMouseOver={e => {
                e.target.style.backgroundColor = 'var(--color-offset)';
                e.target.style.color = 'var(--bg-color-dark)';
            }} onFocus={e => {
                e.target.style.backgroundColor = 'var(--color-offset)';
                e.target.style.color = 'var(--bg-color-dark)';
            }} onMouseOut={e => {
                e.target.style.backgroundColor = 'var(--bg-color-dark)';
                e.target.style.color = 'var(--color-offset)';
            }} onBlur={e => {
                e.target.style.backgroundColor = 'var(--bg-color-dark)';
                e.target.style.color = 'var(--color-offset)';
            }} className="button" onClick={_=> history.push('/')}>Back to Home</button>
        </div>
        : (
            <>
                <div style={{ margin: '1rem 0 .25rem 1rem' }}>You must be logged in as "{location.pathname.split('/profile/')[1]}" to view this page</div>
                <button style={{ marginTop: '.5rem' }} onMouseOver={e => {
                    e.target.style.backgroundColor = 'var(--bg-color-light)';
                    e.target.style.color = 'var(--color-offset)';
                }} onFocus={e => {
                    e.target.style.backgroundColor = 'var(--bg-color-light)';
                    e.target.style.color = 'var(--color-offset)';
                }} onMouseOut={e => {
                    e.target.style.backgroundColor = 'var(--color-offset)';
                    e.target.style.color = 'var(--bg-color-dark)'
                }} onBlur={e => {
                    e.target.style.backgroundColor = 'var(--color-offset)';
                    e.target.style.color = 'var(--bg-color-dark)'
                }} className="button" onClick={_=> history.push('/')}>Back to Home</button>
            </>
        )
    )
}

export default Profile
