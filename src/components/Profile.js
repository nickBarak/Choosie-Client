import React, { useState, useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
// import UserContext from '../store/contexts/User.context';
import { makeRequest } from '../store/actions/makeRequest.action';
import HistoryContext from '../store/contexts/History.context';
import { updateUser } from '../store/actions/updateUser.action';


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
    }, [clearing, showSaveHistory])

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
        ? <>
            <label>Your info</label>
            <ul>
                <li>Name: {user.name}</li>
                <li>Username: {user.username}</li>
                <li>Sex: {user.sex}</li>
                <li>Age: {user.age}</li>
                <li>Languages: {user.languages}</li>
                <li>Country: {user.country}</li>
                <li>Email: {user.email}</li>
            </ul>
            <button onClick={_=> setEditingInfo(!editingInfo)}>Edit Info</button>
            <div className="error-msg" style={{ color: 'maroon' }}>{editInfoError}</div>
            {editingInfo &&
                <form onSubmit={editInfo} style={{ display: 'flex', flexDirection: 'column' }}>
                    <input placeholder="name" />
                    <input placeholder="sex" />
                    <input placeholder="age" />
                    <input placeholder="languages" />
                    <input placeholder="country" />
                    <input placeholder="email" />
                    <button>Submit</button>
                </form>
            }
            <div>
                <span>Show Save History? </span>
                <label><input type="radio" name="showSaveHistoryRadio" value="Yes" onClick={_=> setShowSaveHistory(true)} defaultChecked={user.show_save_history? true : false} />Yes</label>
                <label><input type="radio" name="showSaveHistoryRadio" value="No" onClick={_=> setShowSaveHistory(false)} defaultChecked={user.show_save_history ? false : true} />No</label>
            </div>
            <button onClick={_=> user.recent_save_history.length && setClearing(true)}>
                {user.recent_save_history.length
                    ? clearing
                        ? 'Clearing...'
                        : 'Clear Save History'
                    : 'History Cleared'
                }
            </button>
            <button onClick={_=> setChangingPassword(!changingPassword)}>Change Password</button>
            <div className="error-msg" style={{ color: 'maroon' }}>{changePasswordError}</div>
            {changingPassword &&
                <form onSubmit={changePassword} style={{ display: 'flex', flexDirection: 'column' }}>
                    <input type="password" placeholder="Enter current password" />
                    <input type="password" placeholder="Enter new password" />
                    <input type="password" placeholder="Repeat new password" />
                    <button>Submit</button>
                </form>
            }
            <button onClick={_=> history.push('/')}>Back to Home</button>
        </>
        : (
            <>
                <div>You must be logged in as "{location.pathname.split('/profile/')[1]}" to view this page</div>
                <button onClick={_=> history.push('/')}>Back to Home</button>
            </>
        )
    )
}

export default Profile
