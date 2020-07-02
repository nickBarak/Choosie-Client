import React, { useState, useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
// import UserContext from '../store/contexts/User.context';
import { makeRequest } from '../store/actions/makeRequest.action';
import HistoryContext from '../store/contexts/History.context';
import { updateUser } from '../store/actions/updateUser.action';
import Toggler from './Toggler';


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

    function editInfo(e, signal) {
        if (e) {
            e.persist();
            e.preventDefault();
        }
        const children = e && e.target.children,
              editedInfo = {
                name: e ? children[0].value : user.name,
                sex: e ? children[1].value : user.sex,
                age: e ? children[2].value : user.age,
                languages: e ? children[3].value.split(',') : user.languages,
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
                clearing && setClearing(false);
                dispatch( updateUser(user.username) );
            });
    }

    useEffect(_=> {
        if (!mounted) { mounted = true; return }
        const controller = new AbortController(),
              { signal } = controller;
        editInfo(null, signal);
        return _=> controller.abort();
    }, [clearing, showSaveHistory, showDescriptionOnHover])

    function changePassword(e) {
        e.persist();
        e.preventDefault();
        const children = e.target.children,
              currentPassword = children[0].value,
              newPassword = children[1].value,
              repeatedNewPassword = children[2].value;
        if (currentPassword !== user.password) { setChangePasswordError('Entry for current password was incorrect'); return }
        if (newPassword !== repeatedNewPassword) { setChangePasswordError('New passwords must match'); return };
        if (newPassword.match(/some regex/)) { setChangePasswordError('New password invalid'); return };
        dispatch( makeRequest(`users/${user.username}`, null, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                currentPassword,
                newPassword,
                username: user.username
            })
        }) )
            .then(res => res.ok
                ? dispatch( updateUser(user.username) )
                : setChangePasswordError('Error changing password'))
            .catch(e => setChangePasswordError('Error editing info'));
        [0,1,2].forEach(child => children[child].reset());
    }

    return (
        user && user.username === location.pathname.split('/profile/')[1]
        ? <div className="container" style={{ flexDirection: 'column' }}>
            <div className="register-1">
                <label className="prompt-register">Your info</label>
                <ul className="info-list">
                    <li>
                        <label>Name: </label>
                        <span>{user.name || 'Not specified'}</span>
                    </li>
                    <li>
                        <label>Username: </label>
                        <span>{user.username}</span>
                    </li>
                    <li>
                        <label>Sex: </label>
                        <span>{user.sex || 'Not specified'}</span>
                    </li>
                    <li>
                        <label>Age: </label>
                        <span>{user.age || 'Not specified'}</span>
                    </li>
                    <li>
                        <label>Languages: </label>
                        <span style={{ whiteSpace: 'normal' }}>{user.languages[0].length ? user.languages : 'Not specified'}</span>
                    </li>
                    <li>
                        <label>Country: </label>
                        <span>{user.country || 'Not specified'}</span>
                    </li>
                    <li>
                        <label>Email: </label>
                        <span>{user.email || 'Not specified'}</span>
                    </li>
                </ul>
            </div>
            <div style={{ display: 'flex' }}>
                <div style={{ padding: '1rem' }} className="register-1">
                    <button className="button-register" onClick={_=> setEditingInfo(!editingInfo)}>Edit Info</button>
                    <div className="error-msg" style={{ color: 'maroon' }}>{editInfoError}</div>
                    {editingInfo &&
                        <form onSubmit={editInfo} style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                            <input style={{ width: '80%' }} className="input-register" placeholder="name" />
                            <input style={{ width: '80%' }} className="input-register" placeholder="sex" />
                            <input style={{ width: '80%' }} className="input-register" placeholder="age" />
                            <input style={{ width: '80%' }} className="input-register" placeholder="languages" />
                            <input style={{ width: '80%' }} className="input-register" placeholder="country" />
                            <input style={{ width: '80%' }} className="input-register" placeholder="email" />
                            <button className="button-register">Submit</button>
                        </form>
                    }
                </div>
                <div style={{ padding: '1rem', fontSize: '1rem', minWidth: '50%' }} className="register-1">
                    <Toggler prompt="Show description on hover?" defaultChecked={showDescriptionOnHover} onCheck={_=> setShowDescriptionOnHover(true)} onUncheck={_=> setShowDescriptionOnHover(false)} />
                    <Toggler className="toggler-profile" prompt="Show Save History?" defaultChecked={showSaveHistory} onCheck={_=> setShowSaveHistory(true)} onUncheck={_=> setShowSaveHistory(false)} />
                    <button className="button-register" onClick={_=> user.recent_save_history.length && setClearing(true)}>
                        {user.recent_save_history.length
                            ? clearing
                                ? 'Clearing...'
                                : 'Clear Save History'
                            : 'History Cleared'
                        }
                    </button>
                </div>
                <div style={{ padding: '1rem'}} className="register-1">
                    <button className="button-register" onClick={_=> setChangingPassword(!changingPassword)}>Change Password</button>
                    <div className="error-msg" style={{ color: 'maroon' }}>{changePasswordError}</div>
                    {changingPassword &&
                        <form onSubmit={changePassword} style={{ display: 'flex', flexDirection: 'column' }}>
                            <input style={{ width: '80%' }} className="input-register" type="password" placeholder="Enter current password" />
                            <input style={{ width: '80%' }} className="input-register" type="password" placeholder="Enter new password" />
                            <input style={{ width: '80%' }} className="input-register" type="password" placeholder="Repeat new password" />
                            <button className="button-register">Submit</button>
                        </form>
                    }
                </div>
            </div>
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
                e.target.style.backgroundColor = 'var(--color-offset)';
                e.target.style.color = 'var(--color-offset)';
            }} className="button" onClick={_=> history.push('/')}>Back to Home</button>
        </div>
        : (
            <>
                <div>You must be logged in as "{location.pathname.split('/profile/')[1]}" to view this page</div>
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
