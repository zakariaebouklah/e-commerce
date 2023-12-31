import React from 'react';
import Head from "next/head";
import Lang from "@/components/Lang";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";

function SearchResults(props) {

    return (
        <>
            <Head>
                <title>HerboLAB : Switch Language</title>
                <meta name="description" content="Generated by create next app" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className="pt-12 lg:pt-24">
                <Lang/>
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

export default SearchResults;