import React, {useState, useEffect} from 'react';
import Head from "next/head";
import axios from "axios";
import {toast} from "react-toastify";
import Loader from "@/components/Loader";
import {useToken} from "@/contexts/JWTContext";
import {useRouter} from "next/router";
import {useUser} from "@/contexts/UserContext";
import "react-phone-number-input/style.css";
import {getSession} from "next-auth/react";
import {useTranslation} from "next-i18next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";

function ProfileComplete(props) {

    const {jwt} = useToken();

    const {t} = useTranslation("common")

    const router = useRouter();
    const {locale} = router

    const {user} = useUser();

    const [file, setFile] = useState(null);

    const [loader, setLoader] = useState(true);

    useEffect(() => {
        if(Object.keys(user).length === 0 && props.session === undefined){
            router.replace("/404", "/404", {locale}).then()
        }else{
            setLoader(false)
        }
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault();
        let timeID;

        const daita = new FormData();
        daita.append("file", file);

        setLoader(true)

        let response = {};

        try {
            response = await axios.post(
                "/api/account/edit-pic",
                daita,
                {
                    headers: {
                        Authorization: `Bearer ${jwt}`
                    },
                    withCredentials: true
                }
            )

            if(response) {
                toast.success(response.data.message, {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                })
                router.push('/','/',{locale}).then(() => setLoader(false)).catch()
            }

        }
        catch (e) {
            console.log(e.message)

            timeID = setTimeout(() => {
                setLoader(false);

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

        return () => clearTimeout(timeID)
    }

    return (
        <>
            <Head>
                <title>{Object.keys(user).length > 0 ? "HerboLAB : Complete Profile" : "HerboLAB"}</title>
                <meta name="description" content="Generated by create next app" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className="pt-12 lg:pt-24">
                {
                    loader
                        ?
                        <Loader/>
                        :
                        <div className="px-6 lg:px-8">
                            <h3 className="mb-4 text-xl font-medium text-gray-900 dark:text-white">{t('edit_profile_title')}</h3>
                            <form className="space-y-6" action="#" onSubmit={handleSubmit}>
                                <div>
                                    <label htmlFor="file" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{t('picture_file_label')}</label>
                                    <input onChange={(e) => setFile(e.target.files[0])} type="file" name="file" id={`new-file-${props.pid}`} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" required={true}/>
                                </div>
                                <button type="submit" className="w-full text-white bg-teal-800 effect hover:bg-grn focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">{t('done_button')}</button>
                            </form>
                        </div>
                }
            </main>
        </>
    );
}

export default ProfileComplete;

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