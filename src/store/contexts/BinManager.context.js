import React, { useState, createContext } from 'react';

export const BinManagerContext = createContext(false);

export function BinManagerProvider({ children }) {
    const [binManagerOpen, setBinManagerOpen] = useState(false);

    return (
        <BinManagerContext.Provider value={[ binManagerOpen, setBinManagerOpen ]}>
            {children}
        </BinManagerContext.Provider>
    )
}

export default BinManagerContext