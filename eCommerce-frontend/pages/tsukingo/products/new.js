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

function New(props) {

    const str2bool = (value) => {
        if (value && typeof value === "string") {
            if (value.toLowerCase() === "true") return true;
            if (value.toLowerCase() === "false") return false;
        }
        return value;
    }

    const {jwt} = useToken();

    const router = useRouter();
    const {locale} = router

    const {user} = useUser();

    const {t} = useTranslation("common")

    const [name, setName] = useState("")
    const [price, setPrice] = useState(0)
    const [description, setDescription] = useState("")
    const [weight, setWeight] = useState(0)
    const [inStock, setInStock] = useState(true)
    const [sub, setSub] = useState(null)

    const [subId, setSubId] = useState(0);

    const [subCategories, setSubCategories] = useState([]);
    const [loader, setLoader] = useState(false);

    useEffect(() => {

        setLoader(true);
        let timeID;

        if(Object.keys(user).length > 0){
            axios.get('/api/sub-category/all')
                .then(r => {
                    setSubCategories(r.data);
                    setLoader(false);
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
        }

        return () => clearTimeout(timeID)
    }, [user.username])

    useEffect(() => {
        console.log("effect")
        setLoader(true)
        let timeID;
        console.log("user: ", user)

        if(Object.keys(user).length > 0){

            console.log("user: ", user)
            if (user?.roles?.includes("ROLE_ADMIN")){
                setLoader(false)
            }
            else{
                router.replace("/404", "/404", {locale}).then(() => setLoader(false))
            }
        }else {
            setLoader(true)
            timeID = setTimeout(() => router.replace("/404", "/404", {locale}).then(() => setLoader(false)), 1000*30)
        }

        return () => clearTimeout(timeID)

    }, [user.username])

    const handleSubmit = (e) => {
        e.preventDefault()

        setLoader(true);
        let timeID;

        const productDetails = {name,price,description,weight,inStock}

        axios.post(
            '/api/product/new',
            {productDetails, sub, jwt},
            {headers: {}, withCredentials: true})
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
                router.push('/tsukingo/products','/tsukingo/products',{locale}).then()
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
                    router.push('/tsukingo/products','/tsukingo/products',{locale}).then()
                }, 60000)
            })

        return () => clearTimeout(timeID)
    }

    return (
        <>
            <Head>
                <title>{user?.roles?.includes("ROLE_ADMIN") ? "HerboLAB : New Product": "HerboLAB"}</title>
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
                            <h3 className="mb-4 text-xl font-medium text-gray-900 dark:text-white">{t('product_input_heading')}</h3>
                            <form className="space-y-6" action="#" onSubmit={handleSubmit}>
                                <div>
                                    <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{t('product_name_label')}</label>
                                    <input onChange={(e) => setName(e.target.value)} type="text" name="name" id="name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder={t('product_name_placeholder')} required/>
                                </div>
                                <div>
                                    <label htmlFor="price" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{t('product_price_label')}</label>
                                    <input onChange={(e) => setPrice(parseFloat(e.target.value))} type="text" name="price" id="price" placeholder={t('product_price_placeholder')} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" required/>
                                </div>
                                <div>
                                    <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{t('product_description_label')}</label>
                                    <textarea onChange={(e) => setDescription(e.target.value)} name="description" id="description" placeholder={t('product_description_placeholder')} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" required/>
                                </div>
                                <div>
                                    <label htmlFor="weight" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{t('product_weight_label')}</label>
                                    <input onChange={(e) => setWeight(parseFloat(e.target.value))} name="weight" id="weight" placeholder={t('product_weight_placeholder')} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" required/>
                                </div>
                                <div>
                                    <label htmlFor="in-stock" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{t('product_in_stock_label')}</label>
                                    <div className="radios">

                                        <div className="radio">
                                            <label>{t('product_in_stock_yes')}</label>
                                            <input value={"true"} type="radio" name="inStock" checked={inStock} onChange={(e) => setInStock(str2bool(e.target.value))} required={true}/>
                                        </div>

                                        <div className="radio">
                                            <label>{t('product_in_stock_no')}</label>
                                            <input value={"false"} type="radio" name="inStock" checked={!inStock} onChange={(e) => setInStock(str2bool(e.target.value))} />
                                        </div>

                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="sub-category" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{t('product_sub_category_label')}</label>
                                    <div className="radios2">

                                        {
                                            subCategories.map((sc, index) => {

                                                const {id, name} = sc;

                                                return (
                                                    <div key={index} className="radio2">
                                                        <input value={`${index}`} type="radio" name="sub" checked={id === subId} onChange={(e) => {
                                                            setSubId(id)
                                                            console.log(`Setting sub to ${id}`);
                                                            setSub(id);
                                                        }} required={true}/>
                                                        <label>{name}</label>
                                                    </div>
                                                )
                                            })
                                        }

                                    </div>
                                </div>
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

export default New;