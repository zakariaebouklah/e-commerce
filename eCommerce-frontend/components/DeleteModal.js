import React, {useState} from 'react';
import axios from "axios";
import {useToken} from "@/contexts/JWTContext";
import {toast} from "react-toastify";
import {useRouter} from "next/router";

function DeleteModal(props) {

    const [showModal, setShowModal] = useState(false);

    const {jwt} = useToken();

    const router = useRouter()
    const {locale} = router

    const handleDelete = (e) => {

        e.preventDefault()

        const timeoutIds = [];

        switch (props.context) {
            case "product":
                console.log(`pid: ${props.pid}`)

                axios.delete(`/api/product/delete/${props.pid}`, {
                    headers: {},
                    data: {
                        token: jwt
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
                    })
                    .catch(e => {
                        console.log(e.message)
                    })
                break
            case "category":
                console.log(`cid: ${props.cid}`)

                axios.delete(`/api/category/delete/${props.cid}`, {
                    headers: {},
                    data: {
                        token: jwt
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
                    })
                    .catch(e => {
                        console.log(e.message)
                    })
                break
            case "sub-category":
                console.log(`scid: ${props.scid}`)

                axios.delete(`/api/sub-category/delete/${props.scid}`, {
                    headers: {},
                    data: {
                        token: jwt
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
                    })
                    .catch(e => {
                        console.log(e.message)
                    })
                break
            case "coupon":
                console.log(`cpid: ${props.cpid}`)

                axios.delete(`/api/coupon/delete/${props.cpid}`, {
                    headers: {},
                    data: {
                        token: jwt
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
                    })
                    .catch(e => {
                        console.log(e.message)
                    })
                break
            case "promotion":
                console.log(`prid: ${props.prid}`)
                console.log(`prodId: ${props.prodId}`)

                axios.delete(`/api/promo/delete/${props.prid}`, {
                    headers: {},
                    data: {
                        token: jwt,
                        pid: props.prodId
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
                    })
                    .catch(e => {
                        console.log(e.message)
                    })
                break
            case "stock":
                console.log(`stid: ${props.stid}`)
                console.log(`prodId: ${props.prodId}`)

                axios.delete(`/api/stock/delete/${props.stid}`, {
                    headers: {},
                    data: {
                        token: jwt,
                        pid: props.prodId
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
                    })
                    .catch(e => {
                        console.log(e.message)
                    })
                break
            case "review":
                console.log(`rid: ${props.rid}`)
                console.log(`prodId: ${props.prodId}`)

                axios.delete(`/api/reviews/delete/${props.rid}`, {
                    headers: {},
                    data: {
                        token: jwt,
                        pid: props.prodId
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
                        timeoutIds.push(
                            setTimeout(() => {
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
                        )

                    })
                break
            case "banner":
                console.log(`bid: ${props.bid}`)

                axios.delete(`/api/assets/banners/delete/${props.bid}`, {
                    headers: {},
                    data: {
                        token: jwt
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
                        timeoutIds.push(
                            setTimeout(() => {
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
                        )
                    })
                break
        }

        return () => timeoutIds.forEach((tid) => clearTimeout(tid))
    }

    return (
        <div className="top-0">
            <div className={`z-50 fixed top-0 left-0 right-0 bottom-0 bg-black/75 h-screen ${showModal ? "visible" : "hidden"}`}></div>
            {
                <button onClick={(e) => {
                    e.preventDefault()
                    setShowModal(prev => !prev)
                }}
                        data-modal-target="popup-modal" data-modal-toggle="popup-modal"
                        className="block text-white effect bg-red-700 hover:bg-red-800 dark:bg-gan/75 dark:hover:bg-gan focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-md text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        type="button">
                    {
                        props.context  === "review"
                            ?
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 cursor-pointer">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                            </svg>
                            :
                            "Delete"
                    }
                </button>
            }

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
                                className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                                data-modal-hide="popup-modal">
                            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                                 viewBox="0 0 14 14">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                      strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                            </svg>
                            <span className="sr-only">Close modal</span>
                        </button>
                        <div className="p-6 text-center">
                            <svg className="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" aria-hidden="true"
                                 xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                      strokeWidth="2" d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                            </svg>
                            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">Are you sure you
                                want to delete this {props.context}?</h3>
                            <button onClick={(e) => handleDelete(e)}
                                    data-modal-hide="popup-modal" type="button"
                                    className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2">
                                Yes, I'm sure
                            </button>
                            <button data-modal-hide="popup-modal" type="button"
                                    onClick={(e) => {
                                        e.preventDefault()
                                        setShowModal(false)
                                    }}
                                    className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">No,
                                cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DeleteModal;