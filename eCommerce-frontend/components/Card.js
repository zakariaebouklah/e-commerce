import React, {useEffect, useState} from 'react';
import {useUser} from "@/contexts/UserContext";
import {toast} from "react-toastify";
import axios from "axios";
import {useToken} from "@/contexts/JWTContext";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import {useTranslation} from "next-i18next";
import {useRouter} from "next/router";

function Card(props) {

    const [productId, setProductId] = useState(null);
    const [showAddToCart, setShowAddToCart] = useState(false);
    const [isAlreadyWished, setIsAlreadyWished] = useState(false);

    const {user} = useUser();
    const {jwt} = useToken();

    const {t} = useTranslation("common")

    const router = useRouter();
    const {locale} = router

    const {id, name, price, description, inStock, releasedAt, ratingAvg, reviews, images, updatedAt, discountPrice} = props.product;

    const percentage = ((price - discountPrice)/price)*100;

    useEffect(() => {
        const data = JSON.parse(window.localStorage.getItem(`herbo-wish`))

        if(data?.some(d => d.id === id)) {
            setIsAlreadyWished(true);
        }
    }, [user.username])

    // CRUD Wishlist:

    const handleAddToWishList = (e) => {
        e.preventDefault();

        if(!window.localStorage.getItem(`herbo-wish`)){
            window.localStorage.setItem(`herbo-wish`, JSON.stringify([{id, name, price, ratingAvg, reviews, images, discountPrice}]))
        }
        else{
            const data = JSON.parse(window.localStorage.getItem(`herbo-wish`))

            if(data?.some(d => d.id === id)) {
                toast.warning(`'${name}' has already been added to your wishlist`, {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                })

                return;
            }

            const updatedData = [...data, {id, name, price, ratingAvg, reviews, images, discountPrice}]

            window.localStorage.setItem(`herbo-wish`, JSON.stringify(updatedData));
        }

        //populate backend

        if(Object.keys(user).length !== 0){
            axios.post(`/api/my/wishlist/populate`,
                {token: jwt, p: id},
                {
                    headers: {},
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

        // On every append we dispatch an event to keep track of instant changes in our wishlist

        const wishlistUpdateEvent = new Event('wishlistUpdated');
        window.dispatchEvent(wishlistUpdateEvent);

        toast.success(`'${name}' has been added to your wishlist`, {
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

    const handleRemoveFromWishList = (e) => {
        e.preventDefault();

        const data = JSON.parse(window.localStorage.getItem(`herbo-wish`))

        if(data.filter((d) => d.id === id).length === 0){
            toast.warning(`'${name}' has already been removed from your wishlist`, {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            })

            return ;
        }

        const updatedData = data.filter((d) => d.id !== id)

        window.localStorage.setItem(`herbo-wish`, JSON.stringify(updatedData));

        //populate backend

        if(Object.keys(user).length !== 0){
            axios.delete(`/api/my/wishlist/deletion`, {
                headers: {},
                data: {
                    token: jwt,
                    pid: id
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

        //On every remove we dispatch an event to keep track of instant changes in our wishlist

        const wishlistUpdateEvent = new Event('wishlistUpdated');
        window.dispatchEvent(wishlistUpdateEvent);

        toast.success(`'${name}' has been removed from your wishlist`, {
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

    // CRUD Cart:

    const handleAddToCart = (e) => {
        e.preventDefault();

        if(!window.localStorage.getItem(`herbo-cart`)){
            window.localStorage.setItem(`herbo-cart`, JSON.stringify([{id, name, price, ratingAvg, reviews, images, discountPrice, quantity: 1}]))
        }
        else {
            const data = JSON.parse(window.localStorage.getItem(`herbo-cart`))

            if (data?.some(d => d.id === id)) {

                toast.success(`Updating quantity of '${name}' in your cart`, {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                })

                const product = data.find((d) => d.id === id)

                const updatedData = data.map((item) => {
                    if (item.id === product.id) return {...item, quantity: item.quantity + 1}
                    return item;
                })

                window.localStorage.setItem(`herbo-cart`, JSON.stringify(updatedData));

                //populate backend

                if(Object.keys(user).length !== 0){
                    axios.post(`/api/my/cart/populate`,
                        {token: jwt, p: id},
                        {
                            headers: {},
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

                // On every append we dispatch an event to keep track of instant changes in our cart

                const cartUpdateEvent = new Event('cartUpdated');
                window.dispatchEvent(cartUpdateEvent);

                return;
            }

            const updatedData = [...data, {id, name, price, ratingAvg, reviews, images, discountPrice, quantity: 1}]

            window.localStorage.setItem(`herbo-cart`, JSON.stringify(updatedData));
        }

        //populate backend

        if(Object.keys(user).length !== 0){
            axios.post(`/api/my/cart/populate`,
                {token: jwt, p: id},
                {
                    headers: {},
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

        // On every append we dispatch an event to keep track of instant changes in our cart

        const cartUpdateEvent = new Event('cartUpdated');
        window.dispatchEvent(cartUpdateEvent);

        toast.success(`'${name}' has been added to your cart`, {
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

    const stars = [];
    for (let i = 1; i <= 5; i++) {
        if(i <= ratingAvg){
            stars.push(
                <svg aria-hidden="true" className="h-5 w-5 text-yellow-300" fill="currentColor"
                     viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
            )
        }
        else{
            stars.push(
                <svg aria-hidden="true" className="h-5 w-5 text-yellow-300"
                     viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
            )
        }
    }

    return (
        <div
            onMouseEnter={() => {
                setShowAddToCart(true);
                setProductId(id);
            }}
            onMouseLeave={() => setShowAddToCart(false)}
            className="relative lg:m-10 flex m-3 sm:m-0 sm:w-screen lg:w-full max-w-xs flex-col overflow-hidden rounded-lg border border-gray-100 bg-white shadow-md effect">
            <div className="relative mx-3 mt-3 flex h-60 overflow-hidden rounded-xl" onClick={() => router.push(`/product/${id}`, `/product/${id}`, {locale})}>
                {
                    images.length !== 0 ?
                        <img className="object-cover"
                             src={images[0]?.image}
                             alt="product image"/>
                        :
                        <img className="object-cover"
                             src="/placeholders/no-img-placeholder.jpg"
                             alt="product placeholder"/>
                }
                {
                    discountPrice ?
                        <span
                            className="absolute top-0 left-0 m-2 rounded-full bg-black px-2 text-center text-sm font-medium text-white">{
                            Math.round(percentage * 10)/10
                        }% {t('off')}</span>
                        :
                        <span></span>
                }
                {
                    isAlreadyWished
                        ?
                        <button id="minus-heart" onClick={handleRemoveFromWishList}>
                            <svg xmlns="http://www.w3.org/2000/svg" stroke="currentColor" className="absolute text-gray-400 effect hover:w-7 hover:h-7 hover:text-gan top-2 right-2 w-5 h-5 hover:animate-heart" width="24" height="24" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M12 18c0 1 .25 1.92.67 2.74l-.67.61l-1.45-1.32C5.4 15.36 2 12.27 2 8.5C2 5.41 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.08C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.41 22 8.5c0 1.43-.5 2.76-1.38 4.11c-.79-.38-1.68-.61-2.62-.61c-3.31 0-6 2.69-6 6m2-1v2h8v-2h-8Z"/>
                            </svg>
                        </button>
                        :
                        <button id="heart" onClick={handleAddToWishList}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="absolute text-gray-400 effect hover:w-7 hover:h-7 hover:text-gan top-2 right-2 w-5 h-5 hover:animate-heart">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                            </svg>
                        </button>
                }

            </div>
            <div className="mt-4 px-5 pb-5">
                <a href="#">
                    <h5 className="text-xl tracking-tight text-slate-900">{name}</h5>
                </a>
                <div className="mt-2 mb-5 flex items-center justify-between">
                    <div>
                        {
                            discountPrice
                            ?
                                <div className="flex flex-col">
                                    <span className="text-md font-bold text-slate-900">{discountPrice} MAD</span>
                                    <span className="text-sm text-slate-900 line-through">{price} MAD</span>
                                </div>
                            :
                                <>
                                    <span className="text-md font-bold text-slate-900">{price} MAD</span>
                                </>
                        }
                    </div>
                    {
                        ratingAvg
                        ?
                            <div className="flex items-center">
                                {stars}
                                <span className="mr-2 ml-3 rounded bg-yellow-200 px-2.5 py-0.5 text-xs font-semibold">({reviews.length})</span>
                            </div>
                        :
                            <div className="flex items-center">
                                <svg aria-hidden="true" className="h-5 w-5 text-yellow-300"
                                     viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                                </svg>
                                <svg aria-hidden="true" className="h-5 w-5 text-yellow-300"
                                     viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                                </svg>
                                <svg aria-hidden="true" className="h-5 w-5 text-yellow-300"
                                     viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                                </svg>
                                <svg aria-hidden="true" className="h-5 w-5 text-yellow-300"
                                     viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                                </svg>
                                <svg aria-hidden="true" className="h-5 w-5 text-yellow-300"
                                     viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                                </svg>
                                <span className="mr-2 ml-3 rounded bg-yellow-200 px-2.5 py-0.5 text-xs font-semibold">({reviews.length})</span>
                            </div>
                    }
                </div>
                <button onClick={handleAddToCart}
                        className={`effect w-full flex items-center justify-center rounded-md bg-slate-900 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-opacity duration-500 delay-75 ${showAddToCart && productId === id ? "opacity-100" : "opacity-0"}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-6 w-6" fill="none" viewBox="0 0 24 24"
                         stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round"
                              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
                    </svg>
                    {t('add_to_cart')}
                </button>

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

export default Card;