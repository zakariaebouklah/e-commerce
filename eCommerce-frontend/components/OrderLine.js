import React, {useState} from 'react';
import {useUser} from "@/contexts/UserContext";
import {toast} from "react-toastify";
import axios from "axios";
import {useToken} from "@/contexts/JWTContext";

function OrderLine(props) {

    const {id, quantity} = props.line;
    const {user} = useUser();
    const {jwt} = useToken();

    const [itemQuantity, setItemQuantity] = useState(quantity);

    const handleIncreaseQuantity = () => {

        setItemQuantity(prev => prev+1)

        const data = JSON.parse(window.localStorage.getItem(`herbo-cart`));

        const product = data.find((d) => d.id === id)

        if(product){
            const updatedData = data.map((item) => {
                if (item.id === product.id) return {...item, quantity: itemQuantity+1}
                return item;
            })

            window.localStorage.setItem(`herbo-cart`, JSON.stringify(updatedData));

            //populate backend

            if(Object.keys(user).length !== 0){
                axios.post(`/api/my/cart/populate`, {
                    token: jwt,
                    p: id
                }, {
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

            toast.success(`Updating quantity of '${product.name}' in your cart`, {
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
    }

    const handleDecreaseQuantity = () => {

        const data = JSON.parse(window.localStorage.getItem(`herbo-cart`));

        const product = data.find((d) => d.id === id)

        if(itemQuantity === 1) {

            if(product){

                console.log(product)

                const updatedData = data.map((item) => {
                    if (item.id === product.id) return {...item, quantity: 1}
                    return item;
                })

                window.localStorage.setItem(`herbo-cart`, JSON.stringify(updatedData));
            }
        }
        else{
            setItemQuantity(prev => prev-1)

            if(product){

                console.log(product)

                const updatedData = data.map((item) => {
                    if (item.id === product.id) return {...item, quantity: itemQuantity-1}
                    return item;
                })

                window.localStorage.setItem(`herbo-cart`, JSON.stringify(updatedData));

                //populate backend

                if(Object.keys(user).length !== 0){
                    axios.delete(`/api/my/cart/deletion`, {
                        headers: {},
                        data: {
                            token: jwt,
                            pid: product.id
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
            }

            // On every append we dispatch an event to keep track of instant changes in our cart

            const cartUpdateEvent = new Event('cartUpdated');
            window.dispatchEvent(cartUpdateEvent);

            toast.success(`Updating quantity of '${product.name}' in your cart`, {
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
    }

    return (
        <div
            className="mx-auto flex h-8 items-stretch text-gray-600 shadow-xl">
            <button
                onClick={handleDecreaseQuantity}
                className="flex items-center justify-center rounded-l-md bg-gray-200 px-4 transition hover:bg-black hover:text-white">-
            </button>
            <div
                className="flex w-full items-center justify-center bg-gray-100 px-4 text-xs uppercase transition">{itemQuantity}
            </div>
            <button
                onClick={handleIncreaseQuantity}
                className="flex items-center justify-center rounded-r-md bg-gray-200 px-4 transition hover:bg-black hover:text-white">+
            </button>
        </div>
    );
}

export default OrderLine;