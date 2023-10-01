import {useToken} from "@/contexts/JWTContext";
import React, {useEffect, useState} from 'react';
import {useRouter} from "next/router";
import {toast} from "react-toastify";
import Card from "@/components/Card";
import Loader from "@/components/Loader";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import {useTranslation} from "next-i18next";

function Search(props) {

    const [subCs, setSubCs] = useState([]);
    const [searchWord, setSearchWord] = useState('');

    const [results, setResults] = useState([])
    const [loader, setLoader] = useState(false)

    const {jwt} = useToken();

    const router = useRouter();
    const {locale} = router

    const {t} = useTranslation("common")

    useEffect(() => {

        const subs = [];

        for (const {subCategories} of props.categories) {
            for (const sub of subCategories) {
                subs.push(sub)
            }
        }

        setSubCs(subs);
    }, [props.categories, results])

    const handleSearch = (e) => {
        e.preventDefault()

        setLoader(true)

        const daita = new FormData()
        daita.append("word", searchWord)

        let timeID;

        fetch(
            `/api/search`,
            {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
                body: daita,
            }
        )
            .then(r => r.json())
            .then(data => {
                setResults(data)
                setLoader(false)
            })
            .catch(e => {
                timeID = setTimeout(() => {
                    setLoader(false)
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
                    router.push('/','/',{locale}).then()
                }, 60000)
            })

        return () => clearTimeout(timeID)
    }

    return (
        <>
            <div onClick={(e) => e.stopPropagation()} className="left-0 right-0 top-1/3 rounded-xl border dark:border-black bg-white dark:bg-dark px-4 py-8 lg:py-28 mx-7 relative">

                <form onSubmit={handleSearch} method="post" className="mb-2 flex justify-between w-full">
                    <input type="text"
                           className="placeholder:text-gray-400 dark:placeholder:text-gan/40 dark:text-gan h-12 w-full rounded-md bg-gray-200 dark:bg-black/20 mx-4 px-4 font-medium focus:outline-none"
                           placeholder={`${t('search_placeholder')}`}
                           onChange={(e) => {setSearchWord(e.target.value)}}
                           name="search"
                           id="search"
                           value={searchWord}
                           required={true}
                    />
                    <button
                        type={"submit"}
                        className="shrink-0 flex h-12 w-12 items-center justify-center rounded-lg bg-grn/75 text-white hover:bg-grn effect">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                             stroke="currentColor" className="h-6 w-6">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"></path>
                        </svg>
                    </button>
                </form>
                <div className="flex flex-wrap justify-center lg:space-x-1">
                    <span className="text-sm effect font-bold text-gray-700 dark:text-grn mr-5 hover:text-grn">{t('suggestions')}</span>
                    {
                        subCs.length === 0
                        ?
                            <div className="w-16 h-16">
                                <Loader/>
                            </div>
                        :
                        subCs.map((s, index) => (
                            <button onClick={() => router.push(`/sub-category/${s.id}`, `/sub-category/${s.id}`, {locale})}
                                key={index}
                                className="text-sm effect font-medium text-gray-400 hover:text-blue-600 dark:hover:text-gan">
                                <span className="mr-1 text-gray-300">#</span>{s.name}
                            </button>
                        ))
                    }
                </div>
                <div id="results" className="effect mt-16 lg:mt-7">
                    {
                        loader
                        ?
                            <Loader/>
                        :
                        <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5 justify-evenly justify-items-center">
                            {
                                results.map((p, index) => (
                                    <Card key={index} product={p}/>
                                ))
                            }
                        </div>
                    }
                </div>
            </div>
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

export default Search;