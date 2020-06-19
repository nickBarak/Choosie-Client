import React, { useState, createContext } from 'react';

export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
    const [state, setState] = useState(UserContext._currentValue);
    
    return (
        <UserContext.Provider value={[ state, setState ]}>
            {children}
        </UserContext.Provider>
    )
}

export default UserContext;