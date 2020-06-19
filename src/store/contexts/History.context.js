import React, { createContext } from 'react';
import { useHistory } from 'react-router-dom';

export const HistoryContext = createContext(null);

export const HistoryProvider = ({ children }) => {
    const history = useHistory();

    return (
        <HistoryContext.Provider value={history}>
            {children}
        </HistoryContext.Provider>
    )
}

export default HistoryContext;