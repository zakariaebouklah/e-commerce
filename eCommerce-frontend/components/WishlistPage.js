import React from 'react';
import Card from "@/components/Card";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import {useTranslation} from "next-i18next";

function WishlistPage(props) {

    const wishes = props.wishes;

    const {t} = useTranslation("common")

    return (
        <div className="pt-12 lg:pt-24">
            <h1 className="px-5 lg:px-0 lg:text-center text-base lg:text-2xl font-semibold">{t('my_wishlist')}</h1>
            <div className="flex flex-col justify-center items-center py-14">
                {
                    wishes?.length === 0
                    ?
                    <>
                        <img src="/placeholders/empty-wishlist.png" alt="empty-wishlist" className="aspect-square h-32 lg:h-52 w-32 lg:w-52 relative"/>
                        <p className="text-center text-base lg:text-5xl font-light">{t('empty_wishlist_message')}</p>
                    </>
                    :
                    <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5 justify-evenly justify-items-center">
                        {
                            wishes?.map((w, index) => (
                                <Card key={index} product={w}/>
                            ))
                        }
                    </div>
                }
            </div>
        </div>
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

export default WishlistPage;