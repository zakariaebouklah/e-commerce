import React, {useEffect, useState} from 'react';
import Head from "next/head";
import axios from "axios";
import {toast} from "react-toastify";
import Loader from "@/components/Loader";
import {useToken} from "@/contexts/JWTContext";
import {useRouter} from "next/router";
import {useUser} from "@/contexts/UserContext";
import {useTranslation} from "next-i18next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";

function New(props) {

    const {jwt} = useToken();

    const router = useRouter();
    const {locale} = router

    const {user} = useUser();

    const {t} = useTranslation("common")

    const [name, setName] = useState(null)
    const [quantity, setQuantity] = useState(null)

    const [products, setProducts] = useState([])

    const [p, setP] = useState(null)
    const [pId, setPId] = useState(0);

    const [loader, setLoader] = useState(false);

    useEffect(() => {

        setLoader(true);
        let timeID;

        if(Object.keys(user).length > 0){
            axios.get('/api/product/products')
                .then(r => {
                    setProducts(r.data);
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
        let timeID;
        setLoader(true)
        if(Object.keys(user).length > 0){
            if (!user?.roles?.includes("ROLE_ADMIN")){
                router.replace("/404", "/404", {locale}).then(() => setLoader(false))
            }
            else setLoader(false)
        }else {
            setLoader(true)
            timeID = setTimeout(() => router.replace("/404", "/404", {locale}), 1000*30)
        }

        return () => clearTimeout(timeID)

    }, [user.username])

    const handleSubmit = (e) => {
        e.preventDefault()

        setLoader(true);
        let timeID;

        const stockDetails = {name, quantity}

        axios.post(
            '/api/stock/new',
            {stockDetails, p, jwt},
            {headers: {}, withCredentials: true})
            .then(r => {
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
                router.push('/tsukingo/stocks','/tsukingo/stocks',{locale}).then(() => setLoader(false))
            })
            .catch(e => {
                timeID = setTimeout(() => {
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
                    router.push('/tsukingo/stocks','/tsukingo/stocks',{locale}).then(() => setLoader(false))
                }, 60000)
            })

        return () => clearTimeout(timeID)
    }

    return (
        <>
            <Head>
                <title>{user?.roles?.includes("ROLE_ADMIN") ? "HerboLAB : New Stock": "HerboLAB"}</title>
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
                            <h3 className="mb-4 text-xl font-medium text-gray-900 dark:text-white">{t('spark_interest_stock')}</h3>
                            <form className="space-y-6" action="#" onSubmit={handleSubmit}>
                                <div>
                                    <label htmlFor="percentage" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{t('stock_name_label')}</label>
                                    <input onChange={(e) => setName(e.target.value)} defaultValue={name} type="text" name="name" id={`name`} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="e.g. : Aloe Vera" required={true}/>
                                </div>
                                <div>
                                    <label htmlFor="startsAt" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{t('quantity_label')}</label>
                                    <input onChange={(e) => setQuantity(e.target.value)} defaultValue={quantity} step={1} type="text" name="quantity" id={`quantity`} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="50000" required={true}/>
                                </div>
                                <div>
                                    <label htmlFor="product" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{t('product_label')}</label>
                                    <div className="radios2">

                                        {
                                            products.map((sc, index) => {

                                                const {id, name} = sc;

                                                return (
                                                    <div key={index} className="radio2">
                                                        <input value={`${index}`} type="radio" name="p" checked={id === pId} onChange={(e) => {
                                                            setPId(id)
                                                            console.log(`Setting sub to ${id}`);
                                                            setP(id);
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