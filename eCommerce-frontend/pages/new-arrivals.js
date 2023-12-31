import React, {useEffect, useState} from 'react';
import Head from "next/head";
import Loader from "@/components/Loader";
import Card from "@/components/Card";
import axios from "axios";
import {useRouter} from "next/router";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import Filter from "@/components/Filter";

function NewArrivals(props) {
    const [products, setProducts] = useState([]);

    const [loader, setLoader] = useState(false);

    useEffect(() => {

        setLoader(true);

        axios.get(`/api/product/products`)
            .then(r => {
                setProducts(r.data);
                setLoader(false);
            })
            .catch(e => {
                console.log(e)
            })

    }, [])

    const router = useRouter();
    const { locale } = router;

    console.log("locale: ", locale)

    return (
        <>
            <Head>
                <title>HerboLAB: New Arrivals</title>
                <meta name="description" content="Generated by create next app" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className="pt-16">
                {
                    loader
                        ?
                        <Loader/>
                        :
                        <Filter context={"newest"}/>
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

export default NewArrivals;