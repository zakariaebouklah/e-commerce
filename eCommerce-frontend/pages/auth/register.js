import React, {useState, useEffect} from 'react';
import Head from "next/head";
import { RiEyeCloseLine , RiEyeFill } from "react-icons/ri";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import {toast} from "react-toastify";
import axios from "axios";
import {useRouter} from "next/router";
import {useToken} from "@/contexts/JWTContext";
import {useRefresh} from "@/contexts/RefreshContext";
import Loader from "@/components/Loader";
import {useUser} from "@/contexts/UserContext";
import {getSession, signIn} from "next-auth/react";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import {useTranslation} from "next-i18next";

function Register(props) {

    const [canSee, setCanSee] = useState(false);
    const [isText, setIsText] = useState(false);
    const [phone, setPhone] = useState("");
    const [timeOut, setTimeOut] = useState("");

    const { setTokenExpiration, setJwt } = useToken();
    const { setRefreshToken } = useRefresh();
    const { setUser } = useUser();

    const {t} = useTranslation("common")

    const [userCredentials, setUserCredentials] = useState({
        email : "",
        password : "",
        username : "",
        phone : "",
        street : ""
    })

    const [loader, setLoader] = useState(false);

    const router = useRouter();
    const { locale } = router;

    const handleSubmit = async (e) => {
        e.preventDefault();

        let timeID;

        let errors = phone ?
            ( isValidPhoneNumber(phone) ? undefined : 'Invalid Phone Number.' )
            : 'Phone Number is Required';

        if(errors !== undefined){
            toast.error(errors, {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            })
        }
        else {
            console.log(userCredentials)

            setLoader(true)

            let response = {};

            try {
                response = await axios.post("/api/sign-up", userCredentials)

                if(response) {
                    setTokenExpiration(response.data.jwt_expiration)
                    setRefreshToken(response.data.refresh_token)
                    setJwt(response.data.token)
                    setUser(response.data.user)

                    console.log("jwt_exp : " + response.data.jwt_expiration)

                    window.localStorage.setItem("connected", `${true}`)
                    window.localStorage.setItem("rt", `${response.data.refresh_token}`)

                    router.push('/','/',{locale}).then(() => setLoader(false)).catch()
                }

            }
            catch (e) {
                console.log(e.message)

                timeID = setTimeout(() => {
                    setLoader(false);
                    setTimeOut("Something went wrong...");

                    if(e.response){

                        if(e.response.data.errors !== undefined){
                            const {type, title, detail, violations} = e.response.data.errors;

                            toast.error(title + " - " + detail, {
                                position: "top-center",
                                autoClose: 5000,
                                hideProgressBar: false,
                                closeOnClick: true,
                                pauseOnHover: true,
                                draggable: true,
                                progress: undefined,
                                theme: "dark",
                            })
                        }

                        if(e.response.data.message !== undefined){

                            const message = e.response.data.message;

                            toast.error(message, {
                                position: "top-center",
                                autoClose: 5000,
                                hideProgressBar: false,
                                closeOnClick: true,
                                pauseOnHover: true,
                                draggable: true,
                                progress: undefined,
                                theme: "dark",
                            })
                        }
                    }
                }, 1000*60);

            }
        }

        return () => {
            if (timeID) clearTimeout(timeID)
        }

    }

    function parseJwt (token) {
        let base64Url = token.split('.')[1];
        let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        let jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    }

    const handleChange = (e) => {

        const {name, value} = e.target;

        setUserCredentials((prevData) => ({
            ...prevData,
            [name]: value
        }))

        setUserCredentials((prevData) => ({
            ...prevData,
            phone: phone
        }))
    }

    const handleReveal = () => {
        setCanSee(prev => !prev);
        setIsText(prev => !prev);
    }

    const handleContinueWithGoogle = () => {
        signIn("google").then(r => {})
    }

    const handleContinueWithFacebook = () => {
        signIn("facebook").then(r => {})
    }

    useEffect(() => {
        let timeID;
        console.log("session : ", props.session)
        if(props.session !== undefined){

            setLoader(true)

            axios.post(
                "/api/oauth/connect",
                {oauthData: props.session.user}
            )
                .then(r => {
                    const {exp} = parseJwt(r.data.token + "")
                    setTokenExpiration(exp)
                    setRefreshToken(r.data.refresh_token)
                    setJwt(r.data.token)
                    setUser(r.data.user)

                    window.localStorage.setItem("connected", `${true}`)
                    window.localStorage.setItem("rt", `${r.data.refresh_token}`)

                    router.push('/','/',{locale}).then(() => setLoader(false)).catch()
                })
                .catch(e => {
                    console.log(e)
                    timeID = setTimeout(() => {

                        setLoader(false);
                        setTimeOut("Something went wrong...");

                        if(e.response){

                            if(e.response.data.errors){
                                const {type, title, detail, violations} = e.response.data.errors;

                                toast.error(title + " - " + detail, {
                                    position: "top-center",
                                    autoClose: 5000,
                                    hideProgressBar: false,
                                    closeOnClick: true,
                                    pauseOnHover: true,
                                    draggable: true,
                                    progress: undefined,
                                    theme: "dark",
                                })
                            }

                            if(e.response.data.message){

                                const message = e.response.data.message;

                                toast.error(message, {
                                    position: "top-center",
                                    autoClose: 5000,
                                    hideProgressBar: false,
                                    closeOnClick: true,
                                    pauseOnHover: true,
                                    draggable: true,
                                    progress: undefined,
                                    theme: "dark",
                                })
                            }
                        }
                    }, 1000*60)
                })
        }

        return () => clearTimeout(timeID)

    }, [])

    return (
        <div className="pt-20">
            <Head>
                <title>Registration</title>
                <meta name="description" content="Generated by create next app" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            {
                loader
                ?
                    <Loader/>
                :
                    timeOut
                        ?
                        <p className="text-2xl text-center">{timeOut} 🤔🤕</p>
                        :
                        <div className="flex flex-col lg:container">
                        <div className="container lg:flex lg:flex-row">
                            <form onSubmit={handleSubmit} method="POST" id="register-form" className="form-register">

                                <h2 className="text-2xl text-cyan-900 font-bold dark:text-white">{t('create_account')}
                                    <span className="effect hover:text-grn"> {t('herbolab')}</span>.
                                </h2>

                                <div className="grp">
                                    <label htmlFor="email">{t('email')}</label>
                                    <input onChange={handleChange} placeholder="xyz@example.com" className="input dark:text-gray-500 dark:placeholder:text-gray-500 dark:placeholder:opacity-40 placeholder:opacity-25 placeholder:font-bold" id="e-mail" type="email" name="email" required={true}/>
                                </div>

                                <div className="grp">
                                    <label htmlFor="password">{t('password')}</label>
                                    <div className="flex">
                                        <input onChange={handleChange} placeholder=".........." className="input grp dark:text-gray-500 dark:placeholder:text-gray-500 dark:placeholder:opacity-40 placeholder:opacity-25 placeholder:font-bold placeholder:text-2xl" id="password" type={isText ? "text" : "password"} name="password" required={true}/>
                                        <div className="icon" onClick={handleReveal}>
                                            {
                                                canSee ?
                                                    <RiEyeFill className="text-org dark:text-gray-500" title="Hide"/>
                                                    :
                                                    <RiEyeCloseLine className="text-org dark:text-gray-500" title="Reveal"/>
                                            }
                                        </div>
                                    </div>
                                </div>

                                <div className="inline-grp">
                                    <div className="grp">
                                        <label htmlFor="nickname">{t('nickname')}</label>
                                        <input onChange={handleChange} className="input dark:text-gray-500 dark:placeholder:text-gray-500 dark:placeholder:opacity-40 placeholder:opacity-25 placeholder:font-bold" placeholder="foo bar" id="nickname" type="text" name="username" required={true}/>
                                    </div>

                                    <div className="grp">
                                        <label htmlFor="phone">{t('phone')}</label>
                                        <PhoneInput
                                            international
                                            name="phone"
                                            className="input"
                                            placeholder="Enter phone number"
                                            defaultCountry="MA"
                                            value={phone}
                                            onChange={setPhone}
                                        />
                                    </div>
                                </div>

                                <div className="grp">
                                    <label htmlFor="street">{t('street')}</label>
                                    <input onChange={handleChange} className="input dark:text-gray-500 dark:placeholder:text-gray-500 dark:placeholder:opacity-40 placeholder:opacity-25 placeholder:font-bold" placeholder="1234 Meadow Lane, Springville, Willowbrook 56789" id="street" type="text" name="street" required={true}/>
                                </div>

                                <div className="h-24">
                                    <button type="submit" className="btn mt-9 border-b-2 border-ble dark:border-gray-700 dark:bg-gray-400 dark:hover:bg-gray-700 hover:bg-ble hover:text-white">{t('btn_sign_up')}</button>
                                </div>

                            </form>
                            <div className="bg-gradient-to-br from-grn/75 to-ble/75 dark:bg-gradient-to-br dark:from-dark dark:to-white/25 rounded-md shadow-3xl lg:w-1/2 relative px-6 py-6 sm:px-16 sm:py-16">
                                <div className="space-y-1 flex flex-col items-center">
                                    <img src="/logo.png" loading="lazy" className="w-28 h-28 aspect-square" alt="logo"/>
                                    <h3 className="text-md font-semibold">{t('continue_with_social_media')}</h3>
                                </div>

                                <div className="mt-16 grid space-y-4">
                                    <button onClick={handleContinueWithGoogle} className="group h-12 px-6 border-2 border-gray-300 rounded-full transition duration-300
 hover:border-grn focus:bg-blue-50 active:bg-blue-100">
                                        <div className="relative flex items-center space-x-4 justify-center">
                                            <img src="https://tailus.io/sources/blocks/social/preview/images/google.svg" className="absolute left-0 w-5" alt="google logo"/>
                                            <span className="block w-max font-semibold tracking-wide dark:text-white text-gray-700 text-sm transition duration-300 group-hover:text-grn sm:text-base">{t('continue_with_google')}</span>
                                        </div>
                                    </button>
                                    <button onClick={handleContinueWithFacebook} className="group h-12 px-6 border-2 border-gray-300 rounded-full transition duration-300
                                     hover:border-grn focus:bg-blue-50 active:bg-blue-100">
                                        <div className="relative flex items-center space-x-4 justify-center">
                                            <img src="https://upload.wikimedia.org/wikipedia/en/0/04/Facebook_f_logo_%282021%29.svg" className="absolute left-0 w-5" alt="Facebook logo"/>
                                            <span className="block w-max font-semibold tracking-wide dark:text-white text-gray-700 text-sm transition duration-300 group-hover:text-grn sm:text-base">{t('continue_with_facebook')}</span>
                                        </div>
                                    </button>

                                    <div className="container w-full text-center p-6">
                                        <p className="text-lg">{t('already_have_account')}<span className="font-bold font-domain text-green-300 effect hover:text-grn"><a href={`/${locale}/auth/login`}> {t('log_in')}</a></span></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
            }
        </div>
    );
}

export default Register;

export async function getServerSideProps(ctx) {
    const fs = require('fs');
    const session = await getSession(ctx)
    if (!session) {
        return {
            props: {
                ...(await serverSideTranslations(ctx.locale, ["common"]))
            }
        }
    }
    return {
        props: { session, ...(await serverSideTranslations(ctx.locale, ["common"])) },
    }
}