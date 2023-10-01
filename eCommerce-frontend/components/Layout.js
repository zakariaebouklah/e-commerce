import React, {useEffect, useState} from 'react';
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import {useToken} from "@/contexts/JWTContext";
import axios from "axios";
import {useRefresh} from "@/contexts/RefreshContext";
import {useRouter} from "next/router";
import Sidebar from "@/components/Sidebar";
import {GoSidebarCollapse, GoSidebarExpand} from "react-icons/go";
import {useUser} from "@/contexts/UserContext";
import Loader from "@/components/Loader";
import {useSession, signOut} from "next-auth/react";

function Layout({children}) {

    const router = useRouter()
    const {locale} = router

    const {tokenExpiration, setTokenExpiration, setJwt} = useToken();
    const {user, setUser} = useUser();
    const {refreshToken, setRefreshToken} = useRefresh();
    const {data: session} = useSession();

    const [isExpired, setIsExpired] = useState(tokenExpiration === undefined);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [showSidebar, setShowSidebar] = useState(false);
    const [loader, setLoader] = useState(false);

    useEffect(() => {
        if(!refreshToken){
            refreshJWT()
        }
    }, [refreshToken])

    const refreshJWT = () => {

        const body = !refreshToken ? {refresh_token : window.localStorage.getItem('rt')} : {refresh_token : refreshToken}
        const configData = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        console.log(body)

        if(body.refresh_token){
            axios.post('/api/silent-refresh', body, configData)
                .then(r => {
                    console.log(r)

                    const {exp, username} = parseJwt(r.data.token + "");

                    setTokenExpiration(exp);
                    setUser(r.data.user)
                    setIsExpired(false);
                    setRefreshToken(r.data.refresh_token + "")
                    setJwt(r.data.token)

                    window.localStorage.setItem("connected", `${true}`)
                    window.localStorage.setItem("rt", `${r.data.refresh_token}`)

                })
                .catch(e => {
                    // console.log("error : " + e)
                })
        }
    }

    const calculateDelay = (unixTimestamp) => {
        const currentUnixTimestamp = Math.floor(Date.now() / 1000); // Current Unix timestamp in seconds
        const timeDifferenceInSeconds = unixTimestamp - currentUnixTimestamp;
        return timeDifferenceInSeconds * 1000;
    }

    const checkJWTExpiration = async () => {

        console.log("check local storage...")

        const status = JSON.parse(window.localStorage.getItem('connected'));

        console.log(`status : ${status}`)

        if(status) setIsAuthenticated(true)
        else setIsAuthenticated(false)


        console.log("check")

        console.log("tokenExp : " + tokenExpiration)
        console.log("refreshToken : " + refreshToken)

        if(tokenExpiration){
            const timeUntilExpiration = calculateDelay(tokenExpiration);

            console.log("timeUntilExpiration : "  + timeUntilExpiration)

            if (timeUntilExpiration < 300000) {

                setIsExpired(true);

                window.localStorage.setItem("connected", `${false}`)

                console.log("inside if statement")

                // Refresh the token
                await refreshJWT();
            }
            else{
                setIsExpired(false);
            }

        }

        console.log("isExpired : " + isExpired)

    }

    function parseJwt (token) {
        let base64Url = token.split('.')[1];
        let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        let jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    }

    useEffect(() => {

        // console.log("effect 1")

        // console.log("tokenExpiration : " + tokenExpiration)
        // console.log("expired : " + isExpired)

        if(tokenExpiration){

            // Call the checkTokenExpiration function on mount
            checkJWTExpiration().then(r => {
                console.log(`res : ${r}`)
            }).catch(e => {
                console.log(`error : ${e}`)
            });

            // Schedule the checkJWTExpiration function to run every minute (adjust the interval as needed)
            const interval = setInterval(checkJWTExpiration, 60000);

            // Clear the interval on component unmount to prevent memory leaks
            return () => clearInterval(interval);
        }
        else{
            window.localStorage.setItem("connected", `${false}`)
        }

    }, [tokenExpiration])

    const handleLogout = () => {

        if (session !== undefined){
            setLoader(true)
            signOut({ callbackUrl: `http://localhost:3000/${locale}/auth/login` }).then(r => {})
        }
        setLoader(true)
        setIsAuthenticated(false)
        setTokenExpiration("")
        setRefreshToken("")
        setUser({})
        setJwt('')
        window.localStorage.setItem("connected", `${false}`)
        window.localStorage.setItem("rt", ``)
        router.push("/auth/login","/auth/login",{locale}).then(() => setLoader(false))


    };

    return (
        <>
            <div className="main">
                <NavBar isAuthed={isAuthenticated} logoutHandler={handleLogout}>
                    {
                        user.roles?.includes("ROLE_ADMIN")
                            ?
                        <div onClick={() => setShowSidebar(prev => !prev)} className="cursor-pointer text-grn hover:text-white effect">
                            <GoSidebarCollapse size={35}/>
                        </div>
                            :
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-grn dark:text-white">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M20.893 13.393l-1.135-1.135a2.252 2.252 0 01-.421-.585l-1.08-2.16a.414.414 0 00-.663-.107.827.827 0 01-.812.21l-1.273-.363a.89.89 0 00-.738 1.595l.587.39c.59.395.674 1.23.172 1.732l-.2.2c-.212.212-.33.498-.33.796v.41c0 .409-.11.809-.32 1.158l-1.315 2.191a2.11 2.11 0 01-1.81 1.025 1.055 1.055 0 01-1.055-1.055v-1.172c0-.92-.56-1.747-1.414-2.089l-.655-.261a2.25 2.25 0 01-1.383-2.46l.007-.042a2.25 2.25 0 01.29-.787l.09-.15a2.25 2.25 0 012.37-1.048l1.178.236a1.125 1.125 0 001.302-.795l.208-.73a1.125 1.125 0 00-.578-1.315l-.665-.332-.091.091a2.25 2.25 0 01-1.591.659h-.18c-.249 0-.487.1-.662.274a.931.931 0 01-1.458-1.137l1.411-2.353a2.25 2.25 0 00.286-.76m11.928 9.869A9 9 0 008.965 3.525m11.928 9.868A9 9 0 118.965 3.525" />
                        </svg>
                    }
                </NavBar>
                {
                    showSidebar
                    ?
                    <Sidebar >
                        {showSidebar && <GoSidebarExpand size={35}/>}
                    </Sidebar>
                        :
                        <></>
                }
                {
                    loader
                    ?
                        <Loader/>
                    :
                        <main className="app-content">
                            {children}
                        </main>
                }

                <Footer/>
            </div>
        </>
    );
}

export default Layout;