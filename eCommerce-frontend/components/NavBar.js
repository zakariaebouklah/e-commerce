import React, {useEffect} from 'react';
import {useState} from "react";
import PreNav from "@/components/PreNav";
import axios from "axios";
import Loader from "@/components/Loader";
import Link from "next/link";
import {useRouter} from "next/router";
import {useTranslation} from "next-i18next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";

function NavBar(props) {

    const [showCategories, setShowCategories] = useState(false);
    const [isCategoryHovered, setIsCategoryHovered] = useState(false);
    const [categoryId, setCategoryId] = useState(null);
    const [categories, setCategories] = useState([]);

    const [showNavItems, setShowNavItems] = useState(false);
    const [showConnect, setShowConnect] = useState(false);

    const [loader, setLoader] = useState(false);

    const router = useRouter();
    const { locale } = router;

    const {t} = useTranslation("common")

    useEffect(() => {

        setLoader(true);

        axios.get("/api/categories")
            .then(r => {
                setCategories(r.data)
                setLoader(false)
            })
            .catch(e => {
                console.log(e.message)
            })
    }, []);

    return (
        <>
            {/*Pre-Navbar Section Start*/}
            <PreNav>
                {props.children}
            </PreNav>
            {/*Pre-Navbar Section End*/}
            {/* <!-- ====== Navbar Section Start --> */}
            <header className="flex w-full items-center shadow-3xl z-20 fixed -top-6 bg-white dark:bg-ble">
                <div className="container mx-auto">
                    <div className="relative -mx-4 flex items-center justify-between">
                        <div className="w-60 max-w-full px-4">
                            <button onClick={() => router.push("/", "/", {locale})} className="w-full py-5 flex flex-row">
                                <p className="sm:text-lg lg:text-3xl text-ble dark:text-white hover:dark:text-gan font-bold font-domain effect hover:text-grn">{t('herbolab')}</p>
                            </button>
                        </div>
                        <div className="flex w-full items-center justify-between px-4">
                            <div>
                                <button
                                    onClick={() => {
                                        setShowNavItems(prev => !prev)
                                    }}
                                    id="navbarToggler"
                                    className="absolute right-4 top-1/2 block -translate-y-1/2 rounded-lg px-3 py-[6px] ring-ble focus:ring-2 lg:hidden"
                                >
                                    <span
                                    className="relative my-[6px] block h-[2px] w-[30px] bg-black dark:bg-white"
                                    ></span>
                                    <span
                                    className="relative my-[6px] block h-[2px] w-[30px] bg-black dark:bg-white"
                                    ></span>
                                    <span
                                    className="relative my-[6px] block h-[2px] w-[30px] bg-black dark:bg-white"
                                    ></span>
                                </button>
                                <nav
                                    id="navbarCollapse"
                                    className={showNavItems ? "nav-collapse visible" : "nav-collapse hidden"}
                                >
                                    <ul className="block lg:flex">
                                        <li className="mt-2 text-center items-center justify-center">
                                        {/*    */}
                                            <div className="w-full sm:w-1/2 lg:w-1/4">
                                                <div className="text-center">
                                                    <div
                                                        className="relative inline-block text-left"
                                                    >
                                                        <button
                                                            onClick={() => {
                                                                setShowCategories(prev => !prev)
                                                            }}
                                                            className="flex dark:bg-white dark:hover:bg-org dark:text-dark dark:hover:text-grn bg-org effect hover:bg-blue-950 h-7 items-center justify-center rounded bg-ble text-center font-semibold text-grn w-52">
                                                                {t('all_categories')}
                                                            <span className="pl-2">
                                                                <div className={showCategories ? "rotate-180 transition-all transform ease-in-out" : "rotate-0 transition-all transform ease-in-out"}>
                                                                    <svg
                                                                        width="12"
                                                                        height="7"
                                                                        viewBox="0 0 12 7"
                                                                        className="fill-current"
                                                                    >
                                                                      <path
                                                                          d="M0.564864 0.879232C0.564864 0.808624 0.600168 0.720364 0.653125 0.667408C0.776689 0.543843 0.970861 0.543844 1.09443 0.649756L5.82517 5.09807C5.91343 5.18633 6.07229 5.18633 6.17821 5.09807L10.9089 0.649756C11.0325 0.526192 11.2267 0.543844 11.3502 0.667408C11.4738 0.790972 11.4562 0.985145 11.3326 1.10871L6.60185 5.55702C6.26647 5.85711 5.73691 5.85711 5.41917 5.55702L0.670776 1.10871C0.600168 1.0381 0.564864 0.967492 0.564864 0.879232Z"
                                                                      />
                                                                      <path
                                                                          d="M1.4719 0.229332L6.00169 4.48868L10.5171 0.24288C10.9015 -0.133119 11.4504 -0.0312785 11.7497 0.267983C12.1344 0.652758 12.0332 1.2069 11.732 1.50812L11.7197 1.52041L6.97862 5.9781C6.43509 6.46442 5.57339 6.47872 5.03222 5.96853C5.03192 5.96825 5.03252 5.96881 5.03222 5.96853L0.271144 1.50833C0.123314 1.3605 -5.04223e-08 1.15353 -3.84322e-08 0.879226C-2.88721e-08 0.660517 0.0936127 0.428074 0.253705 0.267982C0.593641 -0.0719548 1.12269 -0.0699964 1.46204 0.220873L1.4719 0.229332ZM5.41917 5.55702C5.73691 5.85711 6.26647 5.85711 6.60185 5.55702L11.3326 1.10871C11.4562 0.985145 11.4738 0.790972 11.3502 0.667408C11.2267 0.543844 11.0325 0.526192 10.9089 0.649756L6.17821 5.09807C6.07229 5.18633 5.91343 5.18633 5.82517 5.09807L1.09443 0.649756C0.970861 0.543844 0.776689 0.543843 0.653125 0.667408C0.600168 0.720364 0.564864 0.808624 0.564864 0.879232C0.564864 0.967492 0.600168 1.0381 0.670776 1.10871L5.41917 5.55702Z"
                                                                      />
                                                                    </svg>
                                                                </div>
                                                            </span>
                                                        </button>
                                                        <div className={showCategories ? "visible" : "hidden"}>
                                                            <div className="absolute left-0 z-10 mt-2 w-full rounded border-[.5px] border-light bg-white py-5 shadow-card transition-all"
                                                            >
                                                                {
                                                                    loader
                                                                    ?
                                                                        <Loader/>
                                                                    :
                                                                        categories.map((category, index) => (
                                                                            <div className="flex flex-col cursor-pointer" key={index}>
                                                                                <div
                                                                                    onClick={() => {
                                                                                        setIsCategoryHovered(prev => !prev)
                                                                                        setCategoryId(category.id)
                                                                                    }}
                                                                                    key={category.id}
                                                                                    className="block py-2 px-5 text-base flex items-center font-semibold text-body-color hover:text-org hover:bg-ble hover:bg-opacity-5 hover:text-ble"
                                                                                >
                                                                                    <span className="text-org dark:text-grn">{category.name}</span>
                                                                                    <span className="pl-2">
                                                                                        <div className={isCategoryHovered && categoryId === category.id ? "rotate-180 transition-all transform ease-in-out" : "rotate-0 transition-all transform ease-in-out"}>
                                                                                            <svg
                                                                                                width="12"
                                                                                                height="7"
                                                                                                viewBox="0 0 12 7"
                                                                                                className="fill-current text-org dark:text-grn"
                                                                                            >
                                                                                              <path
                                                                                                  d="M0.564864 0.879232C0.564864 0.808624 0.600168 0.720364 0.653125 0.667408C0.776689 0.543843 0.970861 0.543844 1.09443 0.649756L5.82517 5.09807C5.91343 5.18633 6.07229 5.18633 6.17821 5.09807L10.9089 0.649756C11.0325 0.526192 11.2267 0.543844 11.3502 0.667408C11.4738 0.790972 11.4562 0.985145 11.3326 1.10871L6.60185 5.55702C6.26647 5.85711 5.73691 5.85711 5.41917 5.55702L0.670776 1.10871C0.600168 1.0381 0.564864 0.967492 0.564864 0.879232Z"
                                                                                              />
                                                                                              <path
                                                                                                  d="M1.4719 0.229332L6.00169 4.48868L10.5171 0.24288C10.9015 -0.133119 11.4504 -0.0312785 11.7497 0.267983C12.1344 0.652758 12.0332 1.2069 11.732 1.50812L11.7197 1.52041L6.97862 5.9781C6.43509 6.46442 5.57339 6.47872 5.03222 5.96853C5.03192 5.96825 5.03252 5.96881 5.03222 5.96853L0.271144 1.50833C0.123314 1.3605 -5.04223e-08 1.15353 -3.84322e-08 0.879226C-2.88721e-08 0.660517 0.0936127 0.428074 0.253705 0.267982C0.593641 -0.0719548 1.12269 -0.0699964 1.46204 0.220873L1.4719 0.229332ZM5.41917 5.55702C5.73691 5.85711 6.26647 5.85711 6.60185 5.55702L11.3326 1.10871C11.4562 0.985145 11.4738 0.790972 11.3502 0.667408C11.2267 0.543844 11.0325 0.526192 10.9089 0.649756L6.17821 5.09807C6.07229 5.18633 5.91343 5.18633 5.82517 5.09807L1.09443 0.649756C0.970861 0.543844 0.776689 0.543843 0.653125 0.667408C0.600168 0.720364 0.564864 0.808624 0.564864 0.879232C0.564864 0.967492 0.600168 1.0381 0.670776 1.10871L5.41917 5.55702Z"
                                                                                              />
                                                                                            </svg>
                                                                                        </div>
                                                                                    </span>
                                                                                </div>
                                                                                <ul>
                                                                                    {
                                                                                        category.subCategories.map((sub) => (
                                                                                            <li
                                                                                                key={sub.id}
                                                                                                className={`effect text-center rounded border-[.5px] border-light bg-grn dark:bg-white py-1 shadow-card transition-all translate-x-1/2 ${isCategoryHovered && category.id === categoryId ? "visible" : "hidden"}`}>
                                                                                                <Link className='text-org dark:text-dark font-semibold' href={{pathname: `/${locale}/sub-category/${sub.id}`}}>{sub.name}</Link>
                                                                                            </li>
                                                                                        ))
                                                                                    }
                                                                                </ul>
                                                                            </div>
                                                                        ))
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        {/*    */}
                                        </li>
                                        <li>
                                            <Link
                                            href={`/${locale}/`}
                                            className="effect flex py-2 hover:text-grn text-base font-medium text-ble dark:text-white dark:hover:text-gan lg:ml-12 lg:inline-flex"
                                            >
                                                {t('home')}
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                            href={`/${locale}/new-arrivals`}
                                            className="effect flex py-2 hover:text-grn text-base font-medium text-ble dark:text-white dark:hover:text-gan lg:ml-12 lg:inline-flex"
                                            >
                                                {t('new_arrivals')}
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                            href={`/${locale}/product/products`}
                                            className="effect flex py-2 hover:text-grn text-base font-medium text-ble dark:text-white dark:hover:text-gan lg:ml-12 lg:inline-flex"
                                            >
                                                {t('shop')}
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                href={`/${locale}/my/account`}
                                                className="effect flex py-2 hover:text-grn text-base font-medium text-ble dark:text-white dark:hover:text-gan lg:ml-12 lg:inline-flex"
                                            >
                                                {t('account')}
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                            href={`/${locale}/payment`}
                                            className="effect flex py-2 hover:text-grn text-base font-medium text-ble dark:text-white dark:hover:text-gan lg:ml-12 lg:inline-flex"
                                            >
                                                {t('payment')}
                                            </Link>
                                        </li>
                                        <li className="mt-2 text-center items-center justify-center lg:hidden">
                                            {/*    */}
                                            <div className="w-full sm:w-1/2 lg:w-1/4">
                                                <div className="text-center">
                                                    <div
                                                        className="relative inline-block text-left"
                                                    >
                                                        <button
                                                            onClick={() => {
                                                                setShowConnect(prev => !prev)
                                                            }}
                                                            className="flex bg-grn py-[5px] items-center justify-center rounded bg-ble text-center font-semibold text-ble w-52">
                                                            {t('connection')}
                                                            <span className="pl-2">
                                                                <div className={showConnect ? "rotate-180 transition-all transform ease-in-out" : "rotate-0 transition-all transform ease-in-out"}>
                                                                    <svg
                                                                        width="12"
                                                                        height="7"
                                                                        viewBox="0 0 12 7"
                                                                        className="fill-current"
                                                                    >
                                                                      <path
                                                                          d="M0.564864 0.879232C0.564864 0.808624 0.600168 0.720364 0.653125 0.667408C0.776689 0.543843 0.970861 0.543844 1.09443 0.649756L5.82517 5.09807C5.91343 5.18633 6.07229 5.18633 6.17821 5.09807L10.9089 0.649756C11.0325 0.526192 11.2267 0.543844 11.3502 0.667408C11.4738 0.790972 11.4562 0.985145 11.3326 1.10871L6.60185 5.55702C6.26647 5.85711 5.73691 5.85711 5.41917 5.55702L0.670776 1.10871C0.600168 1.0381 0.564864 0.967492 0.564864 0.879232Z"
                                                                      />
                                                                      <path
                                                                          d="M1.4719 0.229332L6.00169 4.48868L10.5171 0.24288C10.9015 -0.133119 11.4504 -0.0312785 11.7497 0.267983C12.1344 0.652758 12.0332 1.2069 11.732 1.50812L11.7197 1.52041L6.97862 5.9781C6.43509 6.46442 5.57339 6.47872 5.03222 5.96853C5.03192 5.96825 5.03252 5.96881 5.03222 5.96853L0.271144 1.50833C0.123314 1.3605 -5.04223e-08 1.15353 -3.84322e-08 0.879226C-2.88721e-08 0.660517 0.0936127 0.428074 0.253705 0.267982C0.593641 -0.0719548 1.12269 -0.0699964 1.46204 0.220873L1.4719 0.229332ZM5.41917 5.55702C5.73691 5.85711 6.26647 5.85711 6.60185 5.55702L11.3326 1.10871C11.4562 0.985145 11.4738 0.790972 11.3502 0.667408C11.2267 0.543844 11.0325 0.526192 10.9089 0.649756L6.17821 5.09807C6.07229 5.18633 5.91343 5.18633 5.82517 5.09807L1.09443 0.649756C0.970861 0.543844 0.776689 0.543843 0.653125 0.667408C0.600168 0.720364 0.564864 0.808624 0.564864 0.879232C0.564864 0.967492 0.600168 1.0381 0.670776 1.10871L5.41917 5.55702Z"
                                                                      />
                                                                    </svg>
                                                                </div>
                                                            </span>
                                                        </button>
                                                        <div className={showConnect ? "visible" : "hidden"}>
                                                            <div className="absolute left-0 z-10 mt-2 w-full rounded border-[.5px] border-light bg-white py-5 shadow-card transition-all"
                                                            >
                                                                {
                                                                    props.isAuthed ?

                                                                        <button
                                                                            onClick={props.logoutHandler}
                                                                            className="block py-2 px-5 text-base font-semibold text-body-color hover:text-grn hover:bg-ble hover:bg-opacity-5 hover:text-ble"
                                                                        >
                                                                            {t('log_out')}
                                                                        </button>

                                                                        :

                                                                        <>
                                                                            <a
                                                                                href={`/${locale}/auth/login`}
                                                                                className="block py-2 px-5 text-base font-semibold text-body-color hover:text-grn hover:bg-ble hover:bg-opacity-5 hover:text-ble"
                                                                            >
                                                                                {t('log_in')}
                                                                            </a>
                                                                            <a
                                                                                href={`/${locale}/auth/register`}
                                                                                className="block py-2 px-5 text-base font-semibold text-body-color hover:text-grn hover:bg-ble hover:bg-opacity-5 hover:text-ble"
                                                                            >
                                                                                {t('sign_up')}
                                                                            </a>
                                                                        </>
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            {/*    */}
                                        </li>
                                    </ul>
                                </nav>
                            </div>
                            {
                                props.isAuthed ?

                                    <div className="hidden justify-end pr-16 sm:flex lg:pr-0 space-x-4">
                                        <button
                                            onClick={props.logoutHandler}
                                            className="effect rounded-lg bg-grn py-2 lg:py-3 px-5 lg:px-7 text-sm lg:text-base font-medium text-white hover:bg-opacity-90"
                                        >
                                            {t('log_out')}
                                        </button>
                                    </div>

                                    :

                                    <div className="hidden justify-end pr-16 sm:flex lg:pr-0 space-x-4">
                                        <a className="effect rounded-lg bg-grn py-2 lg:py-3 px-5 lg:px-7 text-sm lg:text-base font-medium text-white hover:bg-opacity-90"
                                           href={`/${locale}/auth/register`}>
                                            {t('sign_up')}
                                        </a>
                                    </div>
                            }
                        </div>
                    </div>
                </div>
            </header>
            {/* <!-- ====== Navbar Section End --> */}
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

export default NavBar;