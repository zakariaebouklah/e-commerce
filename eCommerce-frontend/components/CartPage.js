import React, {useEffect, useState} from 'react';
import OrderLine from "@/components/OrderLine";
import {useUser} from "@/contexts/UserContext";
import {toast} from "react-toastify";
import axios from "axios";
import {useToken} from "@/contexts/JWTContext";
import {useRouter} from "next/router";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import {useTranslation} from "next-i18next";

function CartPage(props) {

    const [cartItems, setCartItems] = useState(props.cartItems);
    const [couponCode, setCouponCode] = useState("");
    const [message, setMessage] = useState("");
    const [coupon, setCoupon] = useState(null);

    let total = 0

    const router = useRouter();
    const {locale} = router

    const {t} = useTranslation("common")

    const {user} = useUser();
    const {jwt} = useToken();

    for (const cartItem of cartItems) {
        if(cartItem.discountPrice){
            total += cartItem.discountPrice * cartItem.quantity
        }
        else{
            total += cartItem.price * cartItem.quantity
        }
    }

    const handleDeleteFromCart = (name,id, lid = 0) => {

        console.log(name, id)

        const data = JSON.parse(window.localStorage.getItem(`herbo-cart`))

        const updatedData = data.filter((d) => d.id !== id)

        window.localStorage.setItem(`herbo-cart`, JSON.stringify(updatedData));

        //populate backend

        if(Object.keys(user).length !== 0){
            axios.delete(`/api/my/cart/order-line/deletion`, {
                headers: {},
                data: {
                    token: jwt,
                    lid
                },
                withCredentials: true
            })
                .then(r => {
                    console.log(r.data)
                    toast.success(r.data.message, {
                        position: "top-center",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "dark",
                    })
                })
                .catch(e => {
                    console.log(e.message)
                })
        }

        //On every remove we dispatch an event to keep track of instant changes in our cart

        const cartUpdateEvent = new Event('cartUpdated');
        window.dispatchEvent(cartUpdateEvent);

        toast.success(`'${name}' has been removed from your cart`, {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
        })
    }

    useEffect(() => {

        if(window.localStorage.getItem(`herbo-cart`)){
            setCartItems(JSON.parse(window.localStorage.getItem(`herbo-cart`)))
        }

        const handleCartUpdate = () => {
            if(window.localStorage.getItem(`herbo-cart`)){
                setCartItems(JSON.parse(window.localStorage.getItem(`herbo-cart`)))
            }
        }

        // listening to cart updates...

        window.addEventListener('cartUpdated', handleCartUpdate);

        // Clean up the event listener when component unmounts
        return () => {
            window.removeEventListener('cartUpdated', handleCartUpdate);
        };

    }, [])

    useEffect(() => {
        if(coupon !== null){
            console.log("coupon is here")
            console.log(coupon[0])
        }else{
            console.log("coupon not here")
        }

    }, [coupon])

    const handleCouponApply = (e) => {
        e.preventDefault()

        axios.post("/api/coupon/verify", {code: couponCode})
            .then(r => r.data)
            .then(data => {
                console.log()
                setMessage(data.message)
                setCoupon(data.coupon)
            })
            .catch(e => {
                console.log(e)
            })
    }

    const handlePurchase = () => {

        if(Object.keys(user).length === 0){
            router.push("/auth/login","/auth/login",{locale})
                .then(() => {
                    toast.error("You need to connect in order to purchase the order.", {
                        position: "top-center",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "dark",
                    })
                })

            return;
        }
        axios.post(
            "/api/order/purchase",
            couponCode ? {couponCode, jwt} : {jwt},
            {withCredentials: true}
        )
            .then(r => {
                console.log(r.data)
                toast.success(r.data.message, {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                })
                // Empty cart : delete items in local storage:

                window.localStorage.setItem(`herbo-cart`, "");

                //On purchase, we dispatch an event to keep track of instant changes in our cart

                const cartUpdateEvent = new Event('cartUpdated');
                window.dispatchEvent(cartUpdateEvent);

                router.push("/", "/", {locale}).then()
            })
            .catch(e => {
                console.log(e)
                if(e.response.data.errors){
                    const {type, title, detail, violations} = e.response.data.errors;

                    toast.error(title + " - " + detail, {
                        position: "top-center",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "dark",
                    })

                    router.push("/", "/", {locale}).then()
                }

                if(e.response.data.message){

                    const message = e.response.data.message;

                    toast.error(message, {
                        position: "top-center",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "dark",
                    })

                    router.push("/", "/", {locale}).then()
                }
            })
    }

    return (
        <div className="pt-12 lg:pt-24">
            <h1 className="px-5 lg:px-0 lg:text-center text-base lg:text-2xl font-semibold">{t('my_cart_title')}</h1>
            {
                cartItems?.length === 0
                    ?
                    <div className="flex flex-col justify-center items-center py-14">
                        <img src="/placeholders/empty-cart.png" alt="empty-cart" className="aspect-square h-32 lg:h-52 w-32 lg:w-52 relative"/>
                        <p className="text-center text-base lg:text-5xl font-light">{t('cart_is_empty')}</p>
                    </div>
                    :
                    <section className="relative py-12 sm:py-16 lg:py-20">
                        <div className="mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="mx-auto mt-8 max-w-2xl md:mt-12">
                                <div className="bg-white shadow dark:bg-black/25">
                                    <div className="px-4 py-6 sm:px-8 sm:py-10">
                                        <div className="lg:px-2">
                                            {message && <p className={message.includes("is valid") ? "text-sm px-2 font-bold text-grn" : "text-sm px-2 font-bold text-gan"}>{message.includes("is valid") ? `${message} Purchase now to profit from it.` : message }</p>}
                                            <div className="p-4 mb-10 lg:flex w-full">
                                                <p className="mb-4 italic">{t('enter_coupon_code')}</p>
                                                <div className="justify-center md:flex">
                                                    <form method="POST" onSubmit={handleCouponApply}>
                                                        <div
                                                            className="flex items-center w-full h-13 pl-3 bg-white bg-gray-100 border rounded-full">
                                                            <input onChange={(e) => setCouponCode(e.target.value)}
                                                                   type="coupon" name="code" id="coupon"
                                                                   placeholder="herbo90off"
                                                                   className="w-full bg-gray-100 outline-none appearance-none focus:outline-none active:outline-none"/>
                                                            <button type="submit"
                                                                    className="text-sm flex items-center px-3 py-1 text-white bg-org dark:bg-teal-800 rounded-full outline-none md:px-4 hover:bg-ble dark:hover:bg-teal-500 effect focus:outline-none active:outline-none">
                                                                <svg aria-hidden="true" data-prefix="fas"
                                                                     data-icon="gift" className="w-8"
                                                                     xmlns="http://www.w3.org/2000/svg"
                                                                     viewBox="0 0 512 512">
                                                                    <path fill="currentColor"
                                                                          d="M32 448c0 17.7 14.3 32 32 32h160V320H32v128zm256 32h160c17.7 0 32-14.3 32-32V320H288v160zm192-320h-42.1c6.2-12.1 10.1-25.5 10.1-40 0-48.5-39.5-88-88-88-41.6 0-68.5 21.3-103 68.3-34.5-47-61.4-68.3-103-68.3-48.5 0-88 39.5-88 88 0 14.5 3.8 27.9 10.1 40H32c-17.7 0-32 14.3-32 32v80c0 8.8 7.2 16 16 16h480c8.8 0 16-7.2 16-16v-80c0-17.7-14.3-32-32-32zm-326.1 0c-22.1 0-40-17.9-40-40s17.9-40 40-40c19.9 0 34.6 3.3 86.1 80h-86.1zm206.1 0h-86.1c51.4-76.5 65.7-80 86.1-80 22.1 0 40 17.9 40 40s-17.9 40-40 40z"/>
                                                                </svg>
                                                                <span className="font-medium">{t('apply_coupon')}</span>
                                                            </button>
                                                        </div>
                                                    </form>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flow-root">
                                            <ul className="-my-8">
                                                {
                                                    cartItems.map((item, index) => {

                                                        const {name, price, images} = item

                                                        const correspondingLine = props.lines.find(l => l.product.id === item.id)

                                                        console.log(correspondingLine)

                                                        return (
                                                            <li key={index} className="flex flex-col space-y-3 py-6 text-left sm:flex-row sm:space-x-5 sm:space-y-0">
                                                                <div className="shrink-0">
                                                                    <img className="h-24 w-24 max-w-full rounded-lg object-cover"
                                                                         src={images !== undefined && images[0]?.image ? images[0].image : "/placeholders/no-img-placeholder.jpg"}
                                                                         alt={`img-${name}`}/>
                                                                </div>

                                                                <div className="relative flex flex-1 flex-col justify-between">
                                                                    <div className="sm:col-gap-5 sm:grid sm:grid-cols-2">
                                                                        <div className="pr-8 sm:pr-5">
                                                                            <p className="text-base text-black dark:text-white font-semibold text-gray-900 dark:text-grn">{name}</p>
                                                                        </div>

                                                                        <div
                                                                            className="mt-4 flex items-end justify-between sm:mt-0 sm:items-start sm:justify-end">
                                                                            <p className="shrink-0 w-20 text-base text-black dark:text-white font-semibold text-gray-900 dark:text-grn sm:order-2 sm:ml-8 sm:text-right">{price} MAD</p>

                                                                            <div className="sm:order-1">
                                                                                <OrderLine line={item}/>
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    <div className="absolute top-0 right-0 flex sm:bottom-0 sm:top-auto">
                                                                        <button onClick={() => {
                                                                            if(Object.keys(user).length !== 0){
                                                                                handleDeleteFromCart(item.name, item.id, correspondingLine.id)
                                                                            }
                                                                            else{
                                                                                handleDeleteFromCart(item.name, item.id)
                                                                            }
                                                                        }} type="button"
                                                                                className="flex rounded p-2 text-center text-gan transition-all duration-200 ease-in-out focus:shadow hover:text-gray-900 hover:bg-gan/70 shadow-3xl">
                                                                            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg"
                                                                                 fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                                <path strokeLinecap="round" strokeLinejoin="round"
                                                                                      strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                                                            </svg>
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </li>
                                                        )
                                                    })
                                                }
                                            </ul>
                                        </div>

                                        <div className="mt-6 border-t border-b py-2">
                                                {
                                                    cartItems.map((item, index) => {

                                                    const {name, price, discountPrice, quantity} = item

                                                    return (
                                                    <div key={index}>
                                                        {
                                                            discountPrice
                                                            ?
                                                            <div>
                                                                <span className="text-gray-500 dark:text-white font-bold">{name} :</span>
                                                                <div className="flex flex-col justify-between ml-4">
                                                                    <div className="flex items-center justify-between">
                                                                        <p className="text-sm text-gray-400">{t('subtotal_discount')}</p>
                                                                        <p className="text-lg font-semibold text-gray-900 dark:text-grn">{discountPrice*quantity} MAD</p>
                                                                    </div>
                                                                    <div className="flex items-center justify-between">
                                                                        <p className="text-sm text-gray-400">{t('subtotal')}</p>
                                                                        <p className={`text-lg font-semibold text-gray-900 dark:text-grn ${discountPrice && "line-through"}`}>{price*quantity} MAD</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            :
                                                            <div>
                                                                <span className="text-gray-500 dark:text-white font-bold">{name} :</span>
                                                                <div className="flex items-center justify-between ml-4">
                                                                    <p className="text-sm text-gray-400">{t('subtotal')}</p>
                                                                    <p className={`text-lg font-semibold text-gray-900 dark:text-grn ${discountPrice && "line-through"}`}>{price*quantity} MAD</p>
                                                                </div>
                                                            </div>
                                                        }
                                                    </div>
                                                    )
                                                })
                                                }
                                        </div>
                                        <div className="mt-6 flex flex-col items-center justify-between">
                                            <div className="w-full">
                                                <p className="text-sm font-medium text-gray-900 dark:text-grn">{t('total')}</p>
                                                <p className={`text-2xl font-semibold text-gray-900 dark:text-grn flex justify-between`}>
                                                    <span className="text-xs font-normal text-gray-400">MAD</span>
                                                    <span className={coupon !== null && coupon[0]?.percentage && "line-through"}>{total}</span>
                                                </p>
                                            </div>
                                            {
                                                coupon !== null && coupon[0]?.percentage
                                                &&
                                                <div className="w-full">
                                                <p className="text-sm font-medium text-gray-900 dark:text-grn">{t('total_with_coupon_discount')}</p>
                                                <p className="text-2xl font-semibold text-gray-900 dark:text-grn flex justify-between">
                                                <span className="text-xs font-normal text-gray-400">MAD</span>
                                                <span>{total  *  coupon[0]?.percentage / 100}</span>
                                                </p>
                                                </div>
                                            }
                                        </div>

                                        <div className="mt-6 text-center">
                                            <button onClick={handlePurchase}
                                            type="button"
                                            className="group inline-flex w-full items-center justify-center rounded-md bg-gray-900 dark:bg-teal-800 dark:hover:bg-teal-500 px-6 py-4 text-lg font-semibold text-white transition-all duration-200 ease-in-out focus:shadow hover:bg-gray-800">
                                                {t('checkout')}
                                                <svg xmlns="http://www.w3.org/2000/svg"
                                                className="group-hover:ml-8 ml-4 h-6 w-6 transition-all" fill="none"
                                                viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                    <path strokeLinecap="round" strokeLinejoin="round"
                                                    d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
            }
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

export default CartPage;