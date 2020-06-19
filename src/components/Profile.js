import React, { useState, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import UserContext from '../store/contexts/User.context';
import { makeRequest } from '../store/actions/makeRequest.action';
import HistoryContext from '../store/contexts/History.context';

function Profile() {
    const [user, setUser] = useContext(UserContext);
    const [editInfoError, setEditInfoError] = useState(null);
    const [editingInfo, setEditingInfo] = useState(false);
    const [changingPassword, setChangingPassword] = useState(false);
    const [changePasswordError, setChangePasswordError] = useState(null);
    const location = useLocation();
    const history = useContext(HistoryContext);
    const dispatch = useDispatch();
    const { error } = useSelector(store => store.makeRequest);

    function editInfo(e) {
        e.persist();
        e.preventDefault();
        const children = e.target.children,
              editedInfo = {
                name: children[0].value,
                sex: children[1].value,
                age: children[2].value,
                languages: children[3].value,
                country: children[4].value,
                email: children[5].value
        };
        dispatch( makeRequest(`users/${user.username}`, null, null, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(editedInfo)
        }) )
        queueMicrotask(_=> error
            ? setUser({
                ...user,
                name: editedInfo.name,
                sex: editedInfo.sex,
                age: editedInfo.age,
                languages: editedInfo.languages,
                country: editedInfo.country,
                email: editedInfo.email
            })
            : setEditInfoError('Error editing info')
        );
    }

    function changePassword(e) {
        e.persist();
        e.preventDefault();
        const children = e.target.children,
              currentPassword = children[0].value,
              newPassword = children[1].value,
              repeatedNewPassword = children[2].value;
        console.log(currentPassword, user.password);
        if (currentPassword !== user.password) { setChangePasswordError('Entry for current password was incorrect'); return }
        if (newPassword !== repeatedNewPassword) { setChangePasswordError('New passwords must match'); return };
        if (newPassword.match(/some regex/)) { setChangePasswordError('New password invalid'); return };
        dispatch( makeRequest(`users/${user.username}`, null, null, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                currentPassword,
                newPassword,
                username: user.username
            })
        }) )
            .then(res => res.ok
                ? setUser({ ...user, password: newPassword })
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
