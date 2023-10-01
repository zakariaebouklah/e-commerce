import { createContext, useContext, useState } from 'react';

const RefreshContext = createContext(null);

export function RefreshProvider({children}) {

    const [refreshToken, setRefreshToken] = useState("");

    return <RefreshContext.Provider value={{refreshToken, setRefreshToken}}>{children}</RefreshContext.Provider>

}

export function useRefresh(){
    return useContext(RefreshContext);
}