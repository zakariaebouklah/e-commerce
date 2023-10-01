import {createContext, useState, useContext} from "react";

const AuthContext = createContext({})

export const AuthProvider = ({children}) => {
    const [auth, setAuth] = useState({})
    const [persist, setPersist] = useState(
        typeof window !== "undefined" ?
        JSON.parse(window.localStorage.getItem('persist'))
            :
            false
    );

    return <AuthContext.Provider value={{auth, setAuth, persist, setPersist}}>{children}</AuthContext.Provider>
}

export  function useAuth(){
    return useContext(AuthContext);
}