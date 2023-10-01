import { createContext, useContext, useState } from 'react';

const JwtContext = createContext(null);

export function TokenProvider({children}){
    const [tokenExpiration, setTokenExpiration] = useState(null);
    const [jwt, setJwt] = useState("");

    return <JwtContext.Provider value={{tokenExpiration, jwt, setTokenExpiration, setJwt}}>{children}</JwtContext.Provider>
}

export function useToken(){
    return useContext(JwtContext);
}