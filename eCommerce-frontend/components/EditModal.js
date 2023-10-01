import React, {useEffect, useState} from 'react';
import {useToken} from "@/contexts/JWTContext";
import axios from "axios";
import {toast} from "react-toastify";
import {useTranslation} from "next-i18next";

function EditModal(props) {

    const {t} = useTranslation("common")

    const isoToDatetimeLocal = (isoString) => {
        const date = new Date(isoString);
        const year = date.getFullYear();
        const month = `${(date.getMonth() + 1).toString().padStart(2, '0')}`;
        const day = `${date.getDate().toString().padStart(2, '0')}`;
        const hours = `${date.getHours().toString().padStart(2, '0')}`;
        const minutes = `${date.getMinutes().toString().padStart(2, '0')}`;
        const seconds = `${date.getSeconds().toString().padStart(2, '0')}`;
        return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
    };

    const str2bool = (value) => {
        if (value && typeof value === "string") {
            if (value.toLowerCase() === "true") return true;
            if (value.toLowerCase() === "false") return false;
        }
        return value;
    }

    const {jwt} = useToken();

    /* Product State*/
    const [n, setName] = useState(props.item.name)
    const [p, setPrice] = useState(props.item.price)
    const [d, setDescription] = useState(props.item.description)
    const [w, setWeight] = useState(props.item.weight)
    const [ins, setInStock] = useState(props.item.inStock)

    /* Category State*/
    const [categoryName, setCategoryName] = useState(props.item.name)

    /* Sub-Category State*/
    const [subCategoryName, setSubCategoryName] = useState(props.item.name)

    /* Coupon State*/
    const [code, setCode] = useState(props.item.code)
    const [percentageCoupon, setPercentageCoupon] = useState(props.item.percentage)
    const [startsAt, setStartsAt] = useState(props.item.startsAt)
    const [endsAt, setEndsAt] = useState(props.item.endsAt)

    /* Promotion State*/
    const [percentagePromo, setPercentagePromo] = useState(props.item.percentage)
    const [startsAtPromo, setStartsAtPromo] = useState(props.item.startsAt)
    const [endsAtPromo, setEndsAtPromo] = useState(props.item.endsAt)

    /* Stock State*/
    const [stockName, setStockName] = useState(props.item.name)
    const [quantity, setQuantity] = useState(props.item.quantity)

    const [showModal, setShowModal] = useState(false);

    const handleSubmit1 = (e) => {
        e.preventDefault()

        const productDetails = {name: n, price: p, description: d, weight: w, inStock: ins}

        axios.put(
            `/api/product/edit/${props.pid}`,
            {productDetails, jwt},
            {headers: {}, withCredentials: true}
        )
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

    }
    const handleSubmit2 = (e) => {
        e.preventDefault()

        const categoryDetails = {name: categoryName}

        console.log(`props.cid : ${props.cid}`)

        axios.put(
            `/api/category/edit/${props.cid}`,
            {categoryDetails, jwt},
            {headers: {}, withCredentials: true}
        )
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

    }
    const handleSubmit3 = (e) => {
        e.preventDefault()

        const subCategoryDetails = {name: subCategoryName}

        console.log(`props.scid : ${props.scid}`)

        axios.put(
            `/api/sub-category/edit/${props.scid}`,
            {subCategoryDetails, jwt},
            {headers: {}, withCredentials: true}
        )
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

    }
    const handleSubmit4 = (e) => {
        e.preventDefault()

        const couponDetails = {code, percentage: percentageCoupon, startsAt: startsAt.replace('T', ' ').slice(0, 19), endsAt: endsAt.replace('T', ' ').slice(0, 19)}

        axios.put(
            `/api/coupon/edit/${props.cpid}`,
            {couponDetails, jwt},
            {headers: {}, withCredentials: true}
        )
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

    }
    const handleSubmit5 = (e) => {
        e.preventDefault()

        const promoDetails = {percentage: percentagePromo, startsAt: startsAtPromo.replace('T', ' ').slice(0, 19), endsAt: endsAtPromo.replace('T', ' ').slice(0, 19)}

        console.log(jwt)

        const pid = props.prodId;

        axios.put(
            `/api/promo/edit/${props.prid}`,
            {promoDetails, jwt, pid},
            {headers: {}, withCredentials: true}
        )
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
    }
    const handleSubmit6 = (e) => {
        e.preventDefault()

        const stockDetails = {name: stockName, quantity}

        console.log(jwt)

        const pid = props.prodId;

        axios.put(
            `/api/stock/edit/${props.stid}`,
            {stockDetails, jwt, pid},
            {headers: {}, withCredentials: true}
        )
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
    }

    const renderSwitch = (param) => {
        switch (param) {
            case "product":
                return (
                    <form className="space-y-6" action="#" onSubmit={handleSubmit1}>
                        <div>
                            <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Product Name</label>
                            <input onChange={(e) => setName(e.target.value)} defaultValue={n} type="text" name="name" id={`name${props.pid}`} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="e.g : Aloe vera..." required/>
                        </div>
                        <div>
                            <label htmlFor="price" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Price</label>
                            <input onChange={(e) => setPrice(parseFloat(e.target.value))} defaultValue={p} type="text" name="price" id={`price${props.pid}`} placeholder="99.9 MAD" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" required/>
                        </div>
                        <div>
                            <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Description</label>
                            <textarea onChange={(e) => setDescription(e.target.value)} defaultValue={d} name="description" id={`description${props.pid}`} placeholder="e.g : How to use the product..." className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" required/>
                        </div>
                        <div>
                            <label htmlFor="weight" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Weight</label>
                            <input onChange={(e) => setWeight(parseFloat(e.target.value))} defaultValue={w} name="weight" id={`weight${props.pid}`} placeholder="100 g" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" required/>
                        </div>
                        <div>
                            <label htmlFor="in-stock" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">In-Stock?</label>
                            <div className="radios">

                                <div className="radio">
                                    <label>Yes</label>
                                    <input value={"true"} type="radio" name="inStock" checked={ins === true} onChange={(e) => setInStock(str2bool(e.target.value))} required={true}/>
                                </div>

                                <div className="radio">
                                    <label>No</label>
                                    <input value={"false"} type="radio" name="inStock" checked={ins === false} onChange={(e) => setInStock(str2bool(e.target.value))} />
                                </div>

                            </div>
                        </div>
                        <button type="submit" className="w-full text-white bg-teal-800 effect hover:bg-grn focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">{t('done_button')}</button>
                    </form>
                )
            case "category":
                return (
                    <form className="space-y-6" action="#" onSubmit={handleSubmit2}>
                        <div>
                            <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Category Name</label>
                            <input onChange={(e) => setCategoryName(e.target.value)} defaultValue={categoryName} type="text" name="name" id={`name${props.cid}`} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="e.g : Aloe vera..." required/>
                        </div>
                        <button type="submit" className="w-full text-white bg-teal-800 effect hover:bg-grn focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">{t('done_button')}</button>
                    </form>
                )
            case "sub-category":
                return (
                    <form className="space-y-6" action="#" onSubmit={handleSubmit3}>
                        <div>
                            <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Category Name</label>
                            <input onChange={(e) => setSubCategoryName(e.target.value)} defaultValue={subCategoryName} type="text" name="name" id={`name${props.scid}`} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="e.g : Aloe vera..." required/>
                        </div>
                        <button type="submit" className="w-full text-white bg-teal-800 effect hover:bg-grn focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">{t('done_button')}</button>
                    </form>
                )
            case "coupon":
                return (
                    <form className="space-y-6" action="#" onSubmit={handleSubmit4}>
                        <div>
                            <label htmlFor="code" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Coupon Code</label>
                            <input onChange={(e) => setCode(e.target.value)} defaultValue={code} type="text" name="code" id="code" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="e.g : ZdTRtopLmcnd" required/>
                        </div>
                        <div>
                            <label htmlFor="percentage-coupon" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Coupon Percentage</label>
                            <input onChange={(e) => setPercentageCoupon(parseFloat(e.target.value))} defaultValue={percentageCoupon} type="text" name="percentage" id="percentage-coupon" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="25.5%" required/>
                        </div>
                        <div>
                            <label htmlFor="starts-at" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Begins at(Optional)</label>
                            <input onChange={(e) => setStartsAt(new Date(e.target.value).toISOString().slice(0, 16))} defaultValue={isoToDatetimeLocal(startsAt)} step={1} type="datetime-local" name="startsAt" id="coupon-begins" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="e.g : Aloe vera..." required={false}/>
                        </div>
                        <div>
                            <label htmlFor="ends-at" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Ends at(Optional)</label>
                            <input onChange={(e) => setEndsAt(new Date(e.target.value).toISOString().slice(0, 16))} defaultValue={isoToDatetimeLocal(endsAt)} step={1} type="datetime-local" name="endsAt" id="coupon-ends" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="e.g : Aloe vera..." required={false}/>
                        </div>
                        <button type="submit" className="w-full text-white bg-teal-800 effect hover:bg-grn focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">{t('done_button')}</button>
                    </form>
                )
            case "promotion":
                return (
                <form className="space-y-6" action="#" onSubmit={handleSubmit5}>
                    <div>
                        <label htmlFor="percentage" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Promotion Percentage</label>
                        <input onChange={(e) => setPercentagePromo(parseFloat(e.target.value))} defaultValue={percentagePromo} type="text" name="percentage" id={`percentage`} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="15.5%" required={true}/>
                    </div>
                    <div>
                        <label htmlFor="starts-at" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Begins at(Optional)</label>
                        <input onChange={(e) => setStartsAtPromo(new Date(e.target.value).toISOString().slice(0, 19))} defaultValue={startsAtPromo ? new Date(`${startsAtPromo}`).toISOString().slice(0, 19): ""} step={1} type="datetime-local" name="startsAt" id="coupon-begins" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="e.g : Aloe vera..." required={false}/>
                    </div>
                    <div>
                        <label htmlFor="ends-at" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Ends at(Optional)</label>
                        <input onChange={(e) => setEndsAtPromo(new Date(e.target.value).toISOString().slice(0, 19))} defaultValue={startsAtPromo ? new Date(`${endsAtPromo}`).toISOString().slice(0, 19): ""} step={1} type="datetime-local" name="endsAt" id="coupon-ends" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="e.g : Aloe vera..." required={false}/>
                    </div>
                    <button type="submit" className="w-full text-white bg-teal-800 effect hover:bg-grn focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">{t('done_button')}</button>
                </form>
                )
            case "stock":
                return (
                    <form className="space-y-6" action="#" onSubmit={handleSubmit6}>
                        <div>
                            <label htmlFor="percentage" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Stock Name</label>
                            <input onChange={(e) => setStockName(e.target.value)} defaultValue={stockName} type="text" name="name" id={`name`} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="15.5%" required={true}/>
                        </div>
                        <div>
                            <label htmlFor="startsAt" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Quantity</label>
                            <input onChange={(e) => setQuantity(parseInt(e.target.value))} defaultValue={quantity} step={1} type="text" name="quantity" id={`quantity`} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="e.g : Aloe vera..." required={true}/>
                        </div>
                        <button type="submit" className="w-full text-white bg-teal-800 effect hover:bg-grn focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">{t('done_button')}</button>
                    </form>
                )

        }
    }

    return (
        <div className="top-0">
            <div className={`z-50 fixed top-0 left-0 right-0 bottom-0 bg-black/75 h-screen ${showModal ? "visible" : "hidden"}`}></div>
            <button onClick={(e) => {
                e.preventDefault()
                setShowModal(prev => !prev)
            }}
                    data-modal-target="authentication-modal" data-modal-toggle="authentication-modal"
                    className="block text-white effect bg-blue-700 hover:bg-blue-800 dark:bg-teal-800 dark:hover:bg-dark focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-md text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="button">
                Edit
            </button>

            <div
                onClick={(e) => e.stopPropagation()}
                id="authentication-modal" tabIndex="-1" aria-hidden="true" className={`flex justify-center items-center fixed top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full ${showModal ? "visible" : "hidden"}`}>
                <div className="relative w-full max-w-md max-h-full">

                    <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                        <button onClick={(e) => {
                            e.preventDefault()
                            setShowModal(false)
                        }} type="button" className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="authentication-modal">
                            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                            </svg>
                            <span className="sr-only">Close modal</span>
                        </button>
                        <div className="px-6 py-6 lg:px-8">
                            <div className="px-6 py-6 lg:px-8">
                                <h3 className="mb-4 text-xl font-medium text-gray-900 dark:text-white">Empower your {props.context} to shine – edit and captivate your audience.</h3>
                                {
                                    renderSwitch(props.context)
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default EditModal;