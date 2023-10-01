import React from 'react';
import {useRouter} from "next/router";
import Link from "next/link";
import {useTranslation} from "next-i18next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";

function WriteReview(props) {

    const {query} = useRouter();

    const {rate, productId, productName, clientReviews} = props

    const {t} = useTranslation("common")

    console.log(clientReviews)

    const ratings = [
        {rating: 5, count: clientReviews?.filter(r => r.rate === 5).length},
        {rating: 4, count: clientReviews?.filter(r => r.rate === 4).length},
        {rating: 3, count: clientReviews?.filter(r => r.rate === 3).length},
        {rating: 2, count: clientReviews?.filter(r => r.rate === 2).length},
        {rating: 1, count: clientReviews?.filter(r => r.rate === 1).length}
    ];

    const totalCount = ratings.reduce((total, rating) => total + rating.count, 0);

    return (
        <>
            <div className="min-w-full bg-gray-50 dark:bg-white/25">
                <div className="my-10 mx-auto max-w-screen-md px-10 py-16">
                    <div className="flex w-full flex-col">
                        <div className="flex flex-col sm:flex-row">
                            <h1 className="max-w-sm text-3xl font-bold text-blue-900">
                                {t('what_people_think')} <br/>
                                {t('about')} <span className="text-ble font-bold font-domain effect hover:text-grn">{productName}</span>
                            </h1>
                            <div className="my-4 rounded-xl bg-white dark:bg-white/25 py-2 px-4 shadow sm:my-0 sm:ml-auto">
                                <div className="flex h-16 items-center text-2xl font-bold text-blue-900">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-yellow-400"
                                         viewBox="0 0 20 20" fill="currentColor">
                                        <path
                                            d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                                    </svg>
                                    <span className="">{rate}</span>
                                </div>
                                <p className="text-sm text-gray-500 dark:text-grn">{t('average_user_rating')}</p>
                            </div>
                        </div>
                        <div className="text-gray-700">
                            <p className="font-medium">{t('reviews')}</p>
                            <ul className="mb-6 mt-2 space-y-2">
                                {
                                    ratings.map(({rating,count}, index) => (
                                        <li className="flex items-center text-sm font-medium" key={index}>
                                            <span className="w-3">{rating}</span>
                                            <span className="mr-4 text-yellow-400">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20"
                                                     fill="currentColor">
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                                                </svg>
                                            </span>
                                            <div className="mr-4 h-2 w-96 overflow-hidden rounded-full bg-gray-300">
                                                <div style={{width: `${Math.round((count/totalCount)*100)}%`}} className={`h-full bg-yellow-400`}></div>
                                            </div>
                                            <span className="w-3">{count}</span>
                                        </li>
                                    ))
                                }
                            </ul>
                        </div>
                        <Link
                            href={{
                                pathname: "/review/new",
                                query: { ...query, productName, productId },
                            }}
                            passHref
                            shallow
                            replace
                        >
                            <button className="w-36 rounded-full effect bg-org hover:bg-ble py-3 text-white font-medium">
                                {t('write_a_review')}
                            </button>
                        </Link>
                    </div>
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

export default WriteReview;