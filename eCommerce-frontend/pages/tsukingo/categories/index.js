import React, {useEffect, useState} from 'react';
import Head from "next/head";
import {BiDotsVerticalRounded} from "react-icons/bi";
import EditModal from "@/components/EditModal";
import DeleteModal from "@/components/DeleteModal";
import axios from "axios";
import Loader from "@/components/Loader";
import {useRouter} from "next/router";
import {useUser} from "@/contexts/UserContext";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import {useTranslation} from "next-i18next";

function Categories(props) {

    const [showModals, setShowModals] = useState(false);
    const [categories, setCategories] = useState([]);
    const [categoryId, setCategoryId] = useState(null);
    const [loader, setLoader] = useState(false);

    const router = useRouter();
    const {locale} = router

    const {user} = useUser();

    const {t} = useTranslation("common")

    useEffect(() => {

        setLoader(true);

        if(Object.keys(user).length > 0){
            axios.get('/api/categories')
                .then(r => {
                    setCategories(r.data)
                    setLoader(false)
                })
                .catch(e => {
                    console.log(e)
                })
        }
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

    return (
        <>
            <Head>
                <title>{user?.roles?.includes("ROLE_ADMIN") ? "HerboLAB : Browse Categories" : "HerboLAB"}</title>
                <meta name="description" content="Generated by create next app" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            {
                loader
                ?
                    <Loader/>
                :
                user.roles?.includes("ROLE_ADMIN")
                    &&
                <main className="pt-12 lg:pt-24">
                    <button onClick={() => router.push("/tsukingo/categories/new", "/tsukingo/categories/new", {locale})} className="uppercase bg-ble text-white p-4 rounded-md mx-4 effect hover:bg-ble/80">
                        {t('new_category')}
                    </button>
                    <div className="p-4">
                        <div className="w-full p-4 m-auto border rounded-lg bg-green-100 dark:bg-white/20 dark:border-black shadow-3xl overflow-y-auto">
                            <div className="my-3 p-3 effect grid grid-cols-2 md:grid-cols-12 sm:grid-cols-3 md:gap-x-[250px] lg:gap-x-[370px] items-center justify-between cursor-pointer">
                                <span className="uppercase">{t('category_name')}</span>
                                <span className="uppercase hidden lg:grid">{t('id')}</span>
                                <span className="uppercase hidden lg:grid">{t('details')}</span>
                            </div>
                            {
                                loader
                                    ?
                                    <Loader/>
                                    :
                                    <ul>
                                        {
                                            categories.map((category, index) => {
                                                const {id, name, subCategories} = category

                                                return (
                                                    <li key={index} className="hover:shadow-3xl bg-green-50 hover:bg-white dark:bg-dark hover:bg-ble effect rounded-lg my-3 p-2 grid md:grid-cols-12 sm:grid-cols-3 md:gap-x-[250px] lg:gap-x-[370px] justify-between cursor-pointer items-center">
                                                        <div className="flex items-center">
                                                            <div className="pl-4">
                                                                <div onClick={() => router.push(`/category/${id}`, `/category/${id}`, {locale})} className="font-bold hover:underline">
                                                                    {name}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="text-gray-700 hidden dark:text-grn lg:flex">#{id}</div>
                                                        <div className={`text-white text-right sm:text-left hidden md:flex items-center rounded-lg p-3 w-fit uppercase bg-teal-800`}>check all ({subCategories.length}) sub-categories</div>
                                                        <div className="text-gray-700 dark:text-grn flex justify-between items-center">
                                                            <div className="container2 space-x-1 w-full">
                                                                <div className={`arrow-right bg-dark dark:bg-teal-500 relative p-5 rounded-lg flex flex-col justify-items-center space-y-4 ${showModals && categoryId === id ? "visible" :"hidden"}`} id="modals">
                                                                    <EditModal context={"category"} item={category} cid={id}/>
                                                                    <DeleteModal context={"category"} cid={id}/>
                                                                </div>
                                                                <button className="p-3" onClick={(e) => {
                                                                    e.preventDefault()
                                                                    e.stopPropagation()
                                                                    setShowModals(prev => !prev)
                                                                    setCategoryId(id)
                                                                }}>
                                                                    <BiDotsVerticalRounded/>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </li>
                                                )
                                            })
                                        }
                                    </ul>
                            }
                        </div>
                    </div>
                </main>
            }

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

export default Categories;