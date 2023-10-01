import React from 'react';
import Link from "next/link";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import {useTranslation} from "next-i18next";

function Lang(props) {

    const {t} = useTranslation("common")

    return (
        <>
            <div onClick={(e) => e.stopPropagation()} className="left-0 right-0 top-1/3 rounded-xl border dark:border-black bg-white dark:bg-dark px-4 py-8 lg:py-28 mx-7 relative">
                <Link href="/" locale="ar">
                    <option
                        className="block py-2 px-5 text-base font-semibold text-body-color hover:text-org hover:bg-ble dark:hover:bg-grn dark:hover:bg-opacity-5 hover:bg-opacity-5 hover:text-ble dark:hover:text-grn"
                    >
                        {t('ar')}
                    </option>
                </Link>
                <Link href="/" locale="en">
                    <option
                        className="block py-2 px-5 text-base font-semibold text-body-color hover:text-org hover:bg-ble dark:hover:bg-grn dark:hover:bg-opacity-5 hover:bg-opacity-5 hover:text-ble dark:hover:text-grn"
                    >
                        {t('en')}
                    </option>
                </Link>
                <Link href="/" locale="fr">
                    <option
                        className="block py-2 px-5 text-base font-semibold text-body-color hover:text-org hover:bg-ble dark:hover:bg-grn dark:hover:bg-opacity-5 hover:bg-opacity-5 hover:text-ble dark:hover:text-grn"
                    >
                        {t('fr')}
                    </option>
                </Link>
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

export default Lang;