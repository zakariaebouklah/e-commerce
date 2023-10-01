import React, {useEffect, useState} from 'react';
import Switch from "@/components/Switch";
import {useRouter} from "next/router";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import {useTranslation} from "next-i18next";

function PreNav(props) {

    const router = useRouter()
    const {locale} = router

    const [showPreNavItems, setShowPreNavItems] = useState(false);
    const [items, setItems] = useState([]);
    const [cartItems, setCartItems] = useState([]);

    const {t} = useTranslation("common")

    useEffect(() => {

        if(window.localStorage.getItem(`herbo-wish`)){
            setItems(JSON.parse(window.localStorage.getItem(`herbo-wish`)))
        }

        if(window.localStorage.getItem(`herbo-cart`)){
            setCartItems(JSON.parse(window.localStorage.getItem(`herbo-cart`)))
        }

        const handleWishlistUpdate = () => {
            if(window.localStorage.getItem(`herbo-wish`)){
                setItems(JSON.parse(window.localStorage.getItem(`herbo-wish`)))
            }
        };

        const handleCartUpdate = () => {
            if(window.localStorage.getItem(`herbo-cart`)){
                setCartItems(JSON.parse(window.localStorage.getItem(`herbo-cart`)))
            }
            else setCartItems([]);
        };

        // listening to wishlist updates...

        window.addEventListener('wishlistUpdated', handleWishlistUpdate);

        // listening to cart updates...

        window.addEventListener('cartUpdated', handleCartUpdate);

        // Clean up the event listener when component unmounts
        return () => {
            window.removeEventListener('wishlistUpdated', handleWishlistUpdate);
            window.removeEventListener('cartUpdated', handleCartUpdate);
        };

    }, [])

    let sumCartItems = 0;

    for (const cartItem of cartItems) {
        sumCartItems += cartItem.quantity;
    }

    let total = 0;

    for (const cartItem of cartItems) {
        if(cartItem.discountPrice){
            total += cartItem.discountPrice * cartItem.quantity
        }
        else{
            total += cartItem.price * cartItem.quantity
        }
    }

    return (
        <>
            <header className="pre-nav">
                <div className="lang">
                    {props.children}
                    <div className="text-center hidden sm:flex">
                        <div className="relative inline-block text-left">
                            <button onClick={() => router.push("/lang/switch", "/lang/switch", {locale})}
                                    className="effect rounded-lg bg-grn py-2 lg:py-1.5 px-3 lg:px-7 text-xs lg:text-base font-medium text-white hover:bg-opacity-90">
                                {t('pre_nav_change_language')}
                            </button>
                        </div>
                    </div>
                </div>
                <button
                    onClick={() => {
                        setShowPreNavItems(prev => !prev)
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
                <nav className="flex flex-row justify-between w-1/2">
                    <ul className={"sub-nav"}>
                        <li className="relative inline-block flex flex-row hidden sm:flex">
                            <button onClick={() => router.push("/search", "/search", { locale })}
                                className="items-center justify-items-center flex focus:outline-none">
                                <svg className="ml-auto h-5 px-4 text-grn hover:text-white effect svg-inline--fa fa-search fa-w-16 fa-9x" aria-hidden="true" focusable="false"
                                     data-prefix="far" data-icon="search" role="img" xmlns="http://www.w3.org/2000/svg"
                                     viewBox="0 0 512 512">
                                    <path fill="currentColor"
                                          d="M508.5 468.9L387.1 347.5c-2.3-2.3-5.3-3.5-8.5-3.5h-13.2c31.5-36.5 50.6-84 50.6-136C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c52 0 99.5-19.1 136-50.6v13.2c0 3.2 1.3 6.2 3.5 8.5l121.4 121.4c4.7 4.7 12.3 4.7 17 0l22.6-22.6c4.7-4.7 4.7-12.3 0-17zM208 368c-88.4 0-160-71.6-160-160S119.6 48 208 48s160 71.6 160 160-71.6 160-160 160z"></path>
                                </svg>
                            </button>
                        </li>
                        <li className="relative inline-block">
                            <button onClick={() => router.push("/my/wishlist", "/my/wishlist", {locale})}>
                                <div className={`${items.length === 0 ? "hidden" : "visible"} absolute -top-1 right-0 z-10 bg-yellow-400 dark:bg-gan text-xs font-bold px-0.5 py-0.5 rounded-sm`}>{items.length}</div>
                                <svg className="h-9 lg:h-10 p-2 text-grn hover:text-white effect svg-inline--fa fa-heart fa-w-16 fa-9x" aria-hidden="true" focusable="false" data-prefix="far" data-icon="heart" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                    <path fill="currentColor" d="M458.4 64.3C400.6 15.7 311.3 23 256 79.3 200.7 23 111.4 15.6 53.6 64.3-21.6 127.6-10.6 230.8 43 285.5l175.4 178.7c10 10.2 23.4 15.9 37.6 15.9 14.3 0 27.6-5.6 37.6-15.8L469 285.6c53.5-54.7 64.7-157.9-10.6-221.3zm-23.6 187.5L259.4 430.5c-2.4 2.4-4.4 2.4-6.8 0L77.2 251.8c-36.5-37.2-43.9-107.6 7.3-150.7 38.9-32.7 98.9-27.8 136.5 10.5l35 35.7 35-35.7c37.8-38.5 97.8-43.2 136.5-10.6 51.1 43.1 43.5 113.9 7.3 150.8z"></path>
                                </svg>
                            </button>
                        </li>
                        <li className="relative inline-block">
                            <button onClick={() => router.push("/my/cart", "/my/cart", {locale})}>
                                <div className={`${cartItems.length === 0 ? "hidden" : "visible"} absolute -top-1 right-0 z-10 bg-yellow-400 dark:bg-gan text-xs font-bold px-0.5 py-0.5 rounded-sm`}>{sumCartItems}</div>
                                <svg className="h-9 lg:h-10 p-2 text-grn hover:text-white effect svg-inline--fa fa-shopping-cart fa-w-18 fa-9x" aria-hidden="true" focusable="false" data-prefix="far" data-icon="shopping-cart" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                                    <path fill="currentColor" d="M551.991 64H144.28l-8.726-44.608C133.35 8.128 123.478 0 112 0H12C5.373 0 0 5.373 0 12v24c0 6.627 5.373 12 12 12h80.24l69.594 355.701C150.796 415.201 144 430.802 144 448c0 35.346 28.654 64 64 64s64-28.654 64-64a63.681 63.681 0 0 0-8.583-32h145.167a63.681 63.681 0 0 0-8.583 32c0 35.346 28.654 64 64 64 35.346 0 64-28.654 64-64 0-18.136-7.556-34.496-19.676-46.142l1.035-4.757c3.254-14.96-8.142-29.101-23.452-29.101H203.76l-9.39-48h312.405c11.29 0 21.054-7.869 23.452-18.902l45.216-208C578.695 78.139 567.299 64 551.991 64zM208 472c-13.234 0-24-10.766-24-24s10.766-24 24-24 24 10.766 24 24-10.766 24-24 24zm256 0c-13.234 0-24-10.766-24-24s10.766-24 24-24 24 10.766 24 24-10.766 24-24 24zm23.438-200H184.98l-31.31-160h368.548l-34.78 160z"></path>
                                </svg>
                            </button>
                        </li>
                    </ul>
                    <div className="flex flex-col font-bold w-1/2 hidden sm:flex">
                        <span className="text-xs text-ble dark:text-white">{t('pre_nav_your_cart')}</span>
                        <span className="text-grn text-xs lg:text-lg">{Math.round(total)} MAD</span>
                    </div>
                    <div className="hidden lg:block">
                        <Switch/>
                    </div>
                </nav>
                <div className={showPreNavItems ? "visible" : "hidden"}>
                    <nav className="nav-collapse-2 flex flex-col justify-items-start justify-center items-start space-y-4 lg:hidden">
                        <li className="relative inline-block flex flex-row">
                            <button onClick={() => {
                                router.push("/search","/search",{locale}).then()
                            }}
                                    className="items-center justify-items-center flex focus:outline-none">
                                <svg className="ml-auto h-5 px-4 text-gray-500 svg-inline--fa fa-search fa-w-16 fa-9x" aria-hidden="true" focusable="false"
                                     data-prefix="far" data-icon="search" role="img" xmlns="http://www.w3.org/2000/svg"
                                     viewBox="0 0 512 512">
                                    <path fill="currentColor"
                                          d="M508.5 468.9L387.1 347.5c-2.3-2.3-5.3-3.5-8.5-3.5h-13.2c31.5-36.5 50.6-84 50.6-136C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c52 0 99.5-19.1 136-50.6v13.2c0 3.2 1.3 6.2 3.5 8.5l121.4 121.4c4.7 4.7 12.3 4.7 17 0l22.6-22.6c4.7-4.7 4.7-12.3 0-17zM208 368c-88.4 0-160-71.6-160-160S119.6 48 208 48s160 71.6 160 160-71.6 160-160 160z"></path>
                                </svg>
                            </button>
                        </li>
                        <li className="text-center flex">
                            <div className="relative inline-block text-left">
                                <button onClick={() => router.push("/lang/switch", "/lang/switch", {locale})}
                                        className="rounded-lg bg-grn py-2 lg:py-1.5 px-3 lg:px-7 text-xs lg:text-base font-medium text-white hover:bg-opacity-90">
                                    {t('pre_nav_change_language')}
                                </button>
                            </div>
                        </li>
                        <li className="flex flex-col font-bold">
                            <span className="text-xs text-ble">{t('pre_nav_your_cart')}</span>
                            <span className="text-grn text-xs lg:text-lg">{Math.round(total)} MAD</span>
                        </li>
                        <li className="flex">
                            <Switch/>
                        </li>
                    </nav>
                </div>

            </header>
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

export default PreNav;