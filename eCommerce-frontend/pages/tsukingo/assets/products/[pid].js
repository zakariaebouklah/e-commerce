import React, {useState,useEffect} from 'react';
import Head from "next/head";
import axios from "axios";
import {toast} from "react-toastify";
import Loader from "@/components/Loader";
import {useToken} from "@/contexts/JWTContext";
import {useRouter} from "next/router";
import {useUser} from "@/contexts/UserContext";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import {useTranslation} from "next-i18next";

function NewProductPicture(props) {

    const {jwt} = useToken();
    const {user} = useUser();

    const router = useRouter();
    const {t} = useTranslation("common")
    const {locale} = router

    const {pid} = router.query;

    const [file, setFile] = useState(null)

    const [loader, setLoader] = useState(false);

    useEffect(() => {

        console.log("user: ", user)
        let timeID;

        setLoader(true)

        if(Object.keys(user).length > 0){
            if (!user?.roles?.includes("ROLE_ADMIN")){
                router.replace("/404", "/404", {locale}).then(() => setLoader(false))
            }
            else setLoader(false)
        }else {
            timeID = setTimeout(() => router.replace("/404", "/404", {locale}), 1000*30)
        }

        return () => clearTimeout(timeID)

    }, [user.username])

    const handleSubmit = async (e) => {
        e.preventDefault()
        let timeID;

        setLoader(true);

        const daita = new FormData();
        daita.append("file", file);

        axios.post(
            '/api/assets/products/new',
            daita,
            {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                    pid
                },
                withCredentials: true
            }
        )
            .then(r => {
                setLoader(false);
                toast.success(r.data.message, {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                })
                router.push(`/product/products`,`/product/products`, {locale}).then()
            })
            .catch(e => {
                timeID = setTimeout(() => {
                    setLoader(false);
                    toast.error(e.message, {
                        position: "top-center",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "dark",
                    })
                    router.push(`/product/products`,`/product/products`,{locale}).then()
                }, 60000)
            })

        return () => clearTimeout(timeID)
    }

    return (
        <>
            <Head>
                <title>{user?.roles?.includes("ROLE_ADMIN") ? "HerboLAB : Associate new picture with product": "HerboLAB"}</title>
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
                        user.roles?.includes("ROLE_ADMIN")
                        &&
                        <div className="px-6 lg:px-8">
                            <h3 className="mb-4 text-xl font-medium text-gray-900 dark:text-white">{t('spark_interest_text')}</h3>
                            <form className="space-y-6" action="@/pages/tsukingo/assets/products/[pid]#" onSubmit={handleSubmit}>
                                <div>
                                    <label htmlFor="file" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{t('file_label')}</label>
                                    <input onChange={(e) => setFile(e.target.files[0])} type="file" name="file" id={`new-file-${props.pid}`} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" required/>
                                </div>
                                <button type="submit" className="w-full text-white bg-teal-800 effect hover:bg-grn focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">{t('done_button')}</button>
                            </form>
                        </div>
                }
            </main>
        </>
    );
}

export async function getServerSideProps({ locale }) {

    console.log("getStaticProps locale : ", locale)
    const fs = require('fs');

    return {
        props: {
            ...(await serverSideTranslations(locale, ["common"]))
        },
    };
}

export default NewProductPicture;