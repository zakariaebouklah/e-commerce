import React from 'react';
import Head from "next/head";
import {useRouter} from "next/router";
import {useTranslation} from "next-i18next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";

function Custom404(props)
{
    const router = useRouter();
    const {locale} = router

    const {t} = useTranslation("common")

    return (
        <>
            <Head>
                <title>Page Not Found</title>
                <meta name="description" content="Generated by create next app" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className="flex flex-col justify-between justify-center items-center">
                {/*<img src="#" alt="logo-404"/>*/}
                {/*<p className="font-domain font-bold text-4xl text-center">404 - Page Not Found</p>*/}
                <section className="relative w-full bg-gradient-to-r from-ble to-grn py-[120px]">
                    <div className="container mx-auto">
                        <div className="-mx-4 flex">
                            <div className="w-full px-4">
                                <div className="mx-auto max-w-[400px] text-center">
                                    <h2
                                        className="mb-2 text-[50px] font-bold leading-none text-white sm:text-[80px] md:text-[100px]"
                                    >
                                        404
                                    </h2>
                                    <h4
                                        className="mb-3 text-[22px] font-semibold leading-tight text-white"
                                    >
                                        {t('404_error_message')}
                                    </h4>
                                    <p className="mb-8 text-lg text-white">
                                        {t('404_deleted_message')}
                                    </p>
                                    <a
                                        href={`/${locale}/`}
                                        className="inline-block rounded-lg border border-white px-8 py-3 text-center text-base font-semibold text-white transition hover:bg-white hover:text-org"
                                    >
                                        {t('404_go_to_home')}
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div
                        className="absolute top-0 left-0 -z-10 flex h-full w-full items-center justify-between space-x-5 md:space-x-8 lg:space-x-14"
                    >
                        <div
                            className="h-full w-1/3 bg-gradient-to-t from-[#FFFFFF14] to-[#C4C4C400]"
                        ></div>
                        <div className="flex h-full w-1/3">
                            <div
                                className="h-full w-1/2 bg-gradient-to-b from-[#FFFFFF14] to-[#C4C4C400]"
                            ></div>
                            <div
                                className="h-full w-1/2 bg-gradient-to-t from-[#FFFFFF14] to-[#C4C4C400]"
                            ></div>
                        </div>
                        <div
                            className="h-full w-1/3 bg-gradient-to-b from-[#FFFFFF14] to-[#C4C4C400]"
                        ></div>
                    </div>
                </section>
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

export default Custom404;