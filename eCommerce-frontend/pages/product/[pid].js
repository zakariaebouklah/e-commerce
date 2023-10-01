import React, {useEffect, useState} from "react";
import {useRouter} from "next/router";
import axios from "axios";
import Loader from "@/components/Loader";
import Head from "next/head";
import Review from "@/components/Review";
import WriteReview from "@/components/WriteReview";
import {toast} from "react-toastify";
import {useUser} from "@/contexts/UserContext";
import {useToken} from "@/contexts/JWTContext";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import {useTranslation} from "next-i18next";

const Product = () => {

    const router = useRouter();
    const {locale} = router

    const [product, setProduct] = useState([]);
    const [loader, setLoader] = useState(false);
    const [isActive, setIsActive] = useState(true);
    const [pictureId, setPictureId] = useState(null);
    const [pictureUrl, setPictureUrl] = useState("");

    const [picToDelete, setPicToDelete] = useState(null)

    const {pid} = router.query;

    const [showModal, setShowModal] = useState(false);

    const {user} = useUser();
    const {jwt} = useToken();

    const { t } = useTranslation('common');

    const stars = [];

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

    useEffect(() => {

        setLoader(true);

        if(pid){
            axios.get(`/api/product/${pid}`)
                .then(r => {
                    setProduct(r.data.product);
                    setPictureId(r.data.product.images[0]?.id)
                    setPictureUrl(r.data.product.images[0]?.image)
                    setLoader(false);
                })
                .catch(e => {
                    console.log(e)
                })
        }

    }, [pid])

    const {id, name, price, description, inStock, ratingAvg, reviews, images, discountPrice} = product

    for (let i = 1; i <= 5; i++) {
        if(i <= ratingAvg){
            stars.push(
                <svg className="block h-4 w-4 align-middle text-yellow-500"
                     xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path
                        d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                        className=""></path>
                </svg>
            )
        }
        else{
            stars.push(
                <svg className="block h-4 w-4 align-middle text-yellow-500"
                     xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path
                        d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                        className=""></path>
                </svg>
            )
        }
    }

    const handleDelete = (e) => {
        e.preventDefault()
        let timeID;

        console.log(picToDelete)

        axios.delete(`/api/assets/products/delete/${picToDelete}`, {
            headers: {},
            data: {
                token: jwt,
                pid
            },
            withCredentials: true
        })
            .then(r => {
                console.log(r.data)
                setShowModal(false);
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
                router.push('/','/',{locale}).then()
            })
            .catch(e => {
                timeID = setTimeout(() => {
                    toast.error(e.message, {
                        position: "top-center",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "dark",
                    })
                    router.push('/','/',{locale}).then()
                }, 60000)
            })

        return () => clearTimeout(timeID)
    }

    return (
        <>
            <Head>
                <title>HerboLAB - Product: {name}</title>
                <meta name="description" content="Generated by create next app" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main>
                <div className="top-0">
                    <div className={`z-50 fixed top-0 left-0 right-0 bottom-0 bg-black/75 h-screen ${showModal ? "visible" : "hidden"}`}></div>
                    <div
                        onClick={(e) => e.preventDefault()}
                        id="popup-modal" tabIndex="-1"
                        className={`fixed top-0 left-0 right-0 bottom-0 z-50 p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full flex justify-center items-center ${showModal ? "visible": "hidden"}`}>
                        <div className="relative w-full max-w-md max-h-full">
                            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                                <button onClick={(e) => {
                                    e.preventDefault()
                                    setShowModal(false)
                                }}
                                        type="button"
                                        className="absolute top-3 right-2.5 text-gray-400 dark:text-gan bg-transparent hover:bg-gray-200 hover:text-gray-900 dark:text-white rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                                        data-modal-hide="popup-modal">
                                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                                         viewBox="0 0 14 14">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                              strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                                    </svg>
                                    <span className="sr-only">Close modal</span>
                                </button>
                                <div className="p-6 text-center">
                                    <svg className="mx-auto mb-4 text-gray-400 dark:text-gan w-12 h-12 dark:text-gray-200" aria-hidden="true"
                                         xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                              strokeWidth="2" d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                                    </svg>
                                    <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gan dark:text-gray-400 dark:text-gan">
                                        {t('delete_picture_modal_title')}
                                    </h3>
                                    <button onClick={(e) => handleDelete(e)}
                                            data-modal-hide="popup-modal" type="button"
                                            className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2">
                                        {t('yes_im_sure')}
                                    </button>
                                    <button data-modal-hide="popup-modal" type="button"
                                            onClick={(e) => {
                                                e.preventDefault()
                                                setShowModal(false)
                                            }}
                                            className="text-gray-500 dark:text-gan bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 dark:text-white focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">No,
                                        {t('no_cancel')}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <section className="py-12 sm:py-16">
                    {
                        loader ?
                            <Loader/>
                            :
                            <div className="container mx-auto px-4">

                                <div
                                    className="lg:col-gap-12 xl:col-gap-16 mt-8 grid grid-cols-1 gap-12 lg:mt-12 lg:grid-cols-5 lg:gap-16">
                                    <div className="lg:col-span-3 lg:row-end-1">
                                        <div className="lg:flex lg:items-start">
                                            <div className="lg:order-2 lg:ml-5">
                                                <div className="max-w-xl overflow-hidden rounded-lg">
                                                    <img className="h-full w-full max-w-full object-cover"
                                                         src={images && images.length !== 0 ? pictureUrl : "/placeholders/no-img-placeholder.jpg"} alt={images && images.length !== 0 ? `main-image-${pictureId}` : "placeholder-image"}/>
                                                </div>
                                            </div>

                                            <div className="mt-2 w-full lg:order-1 lg:w-32 lg:flex-shrink-0">
                                                <div className="flex flex-row items-start lg:flex-col">
                                                    {
                                                        images && images.length !== 0
                                                        &&
                                                        images.map((image, index) => (
                                                            <div onClick={() => {
                                                                setPictureId(image.id);
                                                                setPictureUrl(image.image)
                                                            }}
                                                                    type="button"
                                                                    key={index}
                                                                    className="flex-0 aspect-square mb-3 h-20 overflow-hidden rounded-lg border-2 border-gray-900 text-center">
                                                                <img className="h-full w-full object-cover"
                                                                     src={image.image} alt={`main-image-${image.id}`}/>
                                                                {
                                                                    user !== undefined && user?.roles?.includes("ROLE_ADMIN")
                                                                    &&
                                                                    <button onClick={() => {
                                                                        setShowModal(true)
                                                                        setPicToDelete(image.id)
                                                                    }} className={`absolute -translate-y-12 lg:-translate-y-16 group w-5 h-5 lg:w-6 lg:h-5 rounded-full effect hover:rounded-md hover:w-20 hover:h-10 bg-gan flex justify-start items-center`}
                                                                            aria-current="true">
                                                                        <div className="relative">
                                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-white">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
                                                                            </svg>
                                                                        </div>
                                                                        <span className="text-white opacity-0 group-hover:visible group-hover:opacity-100 transition-opacity duration-75 delay-75 ease-in">Delete</span>
                                                                    </button>
                                                                }
                                                            </div>
                                                        ))
                                                    }
                                                    {
                                                        user !== undefined && user?.roles?.includes("ROLE_ADMIN")
                                                            &&
                                                            <button onClick={() => router.push(`/tsukingo/assets/products/${id}`, `/tsukingo/assets/products/${id}`, {locale})}
                                                                    className="flex-0 aspect-square mb-3 h-20 overflow-hidden rounded-lg border-2 border-gray-900 text-center flex justify-center items-center">
                                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 effect hover:h-9 hover:w-9">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                                                </svg>
                                                            </button>
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="lg:col-span-2 lg:row-span-2 lg:row-end-2">
                                        <h1 className="sm: text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">{name}</h1>

                                        <div className="mt-5 flex items-center">
                                            <div className="flex items-center">{stars}</div>
                                            <p className="ml-2 text-sm font-medium text-gray-500 dark:text-gan">{reviews && reviews.length !== 0 ? reviews.length : 0} Reviews</p>
                                        </div>

                                        <div>
                                            {
                                                inStock
                                                    ?
                                                    <div className="my-3 rounded-md p-4 w-fit bg-grn text-ble font-bold">{t('in_stock')}</div>
                                                    :
                                                    <div className="my-3 rounded-md p-4 w-fit bg-gan text-red-300 font-bold">{t('out_of_stock')}</div>
                                            }
                                        </div>

                                        <div
                                            className="mt-10 flex flex-col items-center justify-between space-y-4 border-t border-b py-4 sm:flex-row sm:space-y-0">
                                            <div className="flex items-end">
                                                {
                                                    discountPrice
                                                        ?
                                                        <div className="flex flex-col">
                                                            <h1 className="text-xl font-bold text-slate-900">{discountPrice} MAD</h1>
                                                            <h1 className="text-lg text-slate-900 line-through">{price} MAD</h1>
                                                        </div>
                                                        :
                                                        <>
                                                            <h1 className="text-xl font-bold text-slate-900">{price} MAD</h1>
                                                        </>
                                                }
                                            </div>

                                            <button
                                                    onClick={handleAddToCart}
                                                    type="button"
                                                    className="inline-flex items-center justify-center rounded-md border-2 border-transparent bg-gray-900 bg-none px-12 py-3 text-center text-base font-bold text-white transition-all duration-200 ease-in-out focus:shadow hover:bg-gray-800">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="shrink-0 mr-3 h-5 w-5" fill="none"
                                                     viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                    <path strokeLinecap="round" strokeLinejoin="round"
                                                          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                                                </svg>
                                                {t('add_product_to_cart')}
                                            </button>
                                        </div>

                                        <ul className="mt-8 space-y-2">
                                            <li className="flex items-center text-left text-sm font-medium text-gray-600 dark:text-grn">
                                                <svg className="mr-2 block h-5 w-5 align-middle text-gray-500 dark:text-gan"
                                                     xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                     stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                          d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                                                          className=""></path>
                                                </svg>
                                                {t('cancel_anytime')}
                                            </li>
                                        </ul>

                                        <div className="lg:col-span-2">
                                            <WriteReview clientReviews={reviews} rate={ratingAvg} productId={pid} productName={name}/>
                                        </div>
                                    </div>

                                    <div className="lg:col-span-3">
                                        <div className="border-b border-gray-300">
                                            <nav className="flex gap-4">
                                                <button onClick={() => setIsActive(prev => !prev)} className={
                                                    isActive
                                                        ?
                                                        "border-b-2 border-gray-900 dark:border-grn dark:hover:border-teal-100 dark:hover:text-teal-200 effect py-4 text-sm font-medium text-gray-900 dark:text-grn hover:border-gray-400 hover:text-gray-800"
                                                        :
                                                        "inline-flex items-center border-b-2 border-transparent py-4 text-sm font-medium text-gray-600 dark:text-white"
                                                }>
                                                    {t('description')}
                                                </button>

                                                <button onClick={() => setIsActive(prev => !prev)} className={
                                                    !isActive
                                                        ?
                                                        "inline-flex border-b-2 border-gray-900 dark:border-grn dark:hover:border-teal-100 dark:hover:text-teal-200 effect py-4 text-sm font-medium text-gray-900 dark:text-grn hover:border-gray-400 hover:text-gray-800"
                                                        :
                                                        "inline-flex items-center border-b-2 border-transparent py-4 text-sm font-medium text-gray-600 dark:text-white"
                                                }>
                                                    {t('reviews')}
                                                    <span
                                                        className="ml-2 block rounded-full bg-gray-500 px-2 py-px text-xs font-bold text-gray-100"> {reviews && reviews.length !== 0 ? reviews.length : 0} </span>
                                                </button>
                                            </nav>
                                        </div>

                                        {/*Description tab*/}
                                        {
                                            isActive
                                            &&
                                            <div className="mt-8 flow-root sm:mt-12">
                                                <h1 className="text-3xl font-bold">{t('description_tab_title')}</h1>
                                                <p className="mt-4">Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia
                                                    accusantium nesciunt fuga.</p>
                                                <h1 className="mt-8 text-3xl font-bold">{t('about')}</h1>
                                                <p className="mt-4">{description}</p>
                                            </div>
                                        }

                                        {/*Reviews tab*/}
                                        {
                                            !isActive
                                            &&
                                            <div className="mt-8 flow-root sm:mt-12">
                                                {
                                                    reviews && reviews.length !== 0
                                                        ?
                                                        <div className="overflow-scroll">
                                                            {
                                                                reviews.map((review, index) => (
                                                                    <Review key={index} prodId={pid} review={review}/>
                                                                ))
                                                            }
                                                        </div>
                                                        :
                                                        <div className="relative">
                                                            <video autoPlay className="relative aspect-video top-0 left-0 min-w-full min-h-full" muted loop
                                                                   controlsList="nodownload">
                                                                <source src="/placeholders/no-reviews-yet.mp4" about="placeholder"/>
                                                            </video>
                                                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center p-4 space-y-4">
                                                                <p className="text-2xl font-bold">{t('no_reviews_yet')}</p>
                                                                <p className="">{t('be_the_first_to_leave_a_review')}</p>
                                                            </div>
                                                        </div>

                                                }
                                            </div>
                                        }
                                    </div>

                                </div>
                            </div>
                    }

                </section>
            </main>
        </>
    );
};

export async function getServerSideProps({ locale }) {

    console.log("getStaticProps locale : ", locale)
    const fs = require('fs');

    return {
        props: {
            ...(await serverSideTranslations(locale, ["common"]))
        },
    };
}

export default Product;
