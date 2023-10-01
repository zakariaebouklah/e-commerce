import React, {useEffect, useState} from 'react';
import Head from "next/head";
import axios from "axios";
import {toast} from "react-toastify";
import Loader from "@/components/Loader";
import {useToken} from "@/contexts/JWTContext";
import {useRouter} from "next/router";
import {useUser} from "@/contexts/UserContext";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import {useTranslation} from "next-i18next";

function NewBanner(props) {

    const {jwt} = useToken();

    const router = useRouter();
    const {locale} = router

    const {user} = useUser();

    const {t} = useTranslation("common")

    const [file, setFile] = useState(null)

    const [products, setProducts] = useState([])
    const [p, setP] = useState(null)
    const [pId, setPId] = useState(0);

    const [subCategories, setSubCategories] = useState([]);
    const [sub, setSub] = useState(null)
    const [subId, setSubId] = useState(0);

    const [selectedOption, setSelectedOption] = useState('');

    const [loader, setLoader] = useState(false);

    useEffect(() => {
        setLoader(true);
        let timeID;

        axios.get('/api/sub-category/all')
            .then(r => {
                setSubCategories(r.data);
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
                }, 60000)
            })
        return () => clearTimeout(timeID)
    }, [])
    useEffect(() => {
        setLoader(true);
        let timeID;

        axios.get('/api/product/products')
            .then(r => {
                setProducts(r.data);
            })
            .catch(e => {
                timrID = setTimeout(() => {
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
                }, 60000)
            })
        return () => clearTimeout(timeID)
    }, [])

    useEffect(() => {
        console.log("effect")
        setLoader(true)
        console.log("user: ", user)
        let timeID;

        if(Object.keys(user).length > 0){

            console.log("user: ", user)
            if (user?.roles?.includes("ROLE_ADMIN")){
                console.log("user?.roles?.includes(\"ROLE_ADMIN\") : ", user?.roles?.includes("ROLE_ADMIN"))
                setLoader(false)
            }
            else{
                router.replace("/404", "/404", {locale}).then(() => setLoader(false))
            }
        }
        else {
            timeID = setTimeout(() => router.replace("/404", "/404", {locale}).then(() => setLoader(false)), 1000*30)
        }

        return () => clearTimeout(timeID)

    }, [user.username])

    const handleSubmit = async (e) => {
        e.preventDefault()
        let timeID;

        setLoader(true);

        console.log(file)
        console.log(sub)
        console.log(p)

        const asset = new FormData();
        asset.append("file", file)

        axios.post(
            '/api/assets/banners/new',
            asset,
            {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                    pid: p,
                    scid: sub
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
                router.push(`/`,`/`,{locale}).then()
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
                    router.push(`/`,`/`,{locale}).then()
                }, 60000)
            })

        return () => clearTimeout(timeID)
    }

    const handle1stSectionChange = (id) => {
        setPId(id)
        console.log(`Setting p to ${id}`);
        console.log(`id === pId : ${id === pId}`)
        setP(id)
    }

    const handle2ndSectionChange = (id) => {
        setSubId(id)
        console.log(`Setting sub to ${id}`);
        console.log(`id === subId : ${id === subId}`);
        console.log(`id === sub : ${id === sub}`);
        setSub(id);
    }

    console.log("loader: ", loader)

    return (
        <>
            <Head>
                <title>{user?.roles?.includes("ROLE_ADMIN") ? "HerboLAB : Add new banner picture/video" : "HerboLAB"}</title>
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
                            <h3 className="mb-4 text-xl font-medium text-gray-900 dark:text-white">{t('banner_title')}</h3>
                            <form className="space-y-6" action="@/pages/tsukingo/assets/products/[pid]#" onSubmit={handleSubmit}>
                                <div>
                                    <label htmlFor="file" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{t('attachment_label')}</label>
                                    <input onChange={(e) => setFile(e.target.files[0])} type="file" name="file" id={`new-file-${props.pid}`} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" required/>
                                </div>
                                <div>
                                    <label htmlFor="choice" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{t('optional_banner_label')}</label>
                                    <div className="radios">

                                        <div className="radio">
                                            <input value="product" type="radio" name="product" checked={selectedOption === "product"} onChange={(e) => {
                                                setSelectedOption(e.target.value)
                                                setSub(null)
                                                setSubId(0)
                                            }}/>
                                            <label>{t('product_radio_label')}</label>
                                        </div>

                                        <div className="radio">
                                            <input value="sub-category" type="radio" name="sub-category" checked={selectedOption === "sub-category"} onChange={(e) => {
                                                setSelectedOption(e.target.value)
                                                setP(null)
                                                setPId(0)
                                            }} />
                                            <label>{t('sub_category_radio_label')}</label>
                                        </div>

                                    </div>
                                </div>
                                {
                                    selectedOption === "product"
                                    &&
                                    <div>
                                        <label htmlFor="product" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{t('optional_product_label')}</label>
                                        <div className="radios2">

                                            {
                                                !products
                                                    ?
                                                    <Loader/>
                                                    :
                                                    products.map((p, index) => {

                                                        const {id, name} = p;

                                                        return (
                                                            <div key={index} className="radio2">
                                                                <input value={`${index}`} type="radio" name={`p-${index}`} checked={id === pId} onChange={() => handle1stSectionChange(id)} />
                                                                <label>{name}</label>
                                                            </div>
                                                        )
                                                    })
                                            }

                                        </div>
                                    </div>
                                }
                                {
                                    selectedOption === "sub-category"
                                    &&
                                    <div>
                                        <label htmlFor="sub-category" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{t('optional_sub_category_label')}</label>
                                        <div className="radios2">

                                            {
                                                !subCategories
                                                    ?
                                                    <Loader/>
                                                    :
                                                    subCategories.map((sc, index) => {

                                                        const {id, name} = sc;

                                                        return (
                                                            <div key={index} className="radio2">
                                                                <input value={`${index}`} type="radio" name={`sub-${index}`} checked={id === subId} onChange={() => handle2ndSectionChange(id)}/>
                                                                <label>{name}</label>
                                                            </div>
                                                        )
                                                    })
                                            }

                                        </div>
                                    </div>
                                }
                                <button type="submit" className="w-full text-white bg-teal-800 effect hover:bg-grn focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">{t('done_button')}</button>
                            </form>
                        </div>
                }
            </main>
        </>
    );
}

export async function getStaticProps({ locale }) {

    console.log("getStaticProps locale : ", locale)
    const fs = require('fs');

    return {
        props: {
            ...(await serverSideTranslations(locale, ["common"]))
        },
    };
}

export default NewBanner;