import React, {useEffect, useState} from 'react';
import Head from "next/head";
import CartPage from "@/components/CartPage";
import {useUser} from "@/contexts/UserContext";
import axios from "axios";
import {useToken} from "@/contexts/JWTContext";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";

function Cart(props) {

    const {user} = useUser();
    const {jwt} = useToken();

    const [items, setItems] = useState([]);
    const [backendItems, setBackendItems] = useState([]);

    //effect part 1
    useEffect(() => {
        if (Object.keys(user).length !== 0){
            axios.get('/api/my/cart',
                {
                    headers: {
                        Authorization: `Bearer ${jwt}`
                    },
                    withCredentials: true
                }
            )
                .then(r => {
                    console.log(r.data)
                    setBackendItems(r.data.cart.commandLines)
                })
                .catch(e => {
                    console.log(e)
                })

        }

    }, [jwt])

    console.log("backendItems", backendItems)
    console.log("items", items)

    //effect part 2
    useEffect(() => {
        // Calculate and log the difference whenever backendItems changes

        if (backendItems.length !== 0) {
            //populate frontend
            const notInLocal = backendItems.filter((backendItem) => !items.some((localItem) => localItem.id === backendItem.product.id));

            console.log("backendItems", backendItems)
            console.log("notInLocal", notInLocal)

            const data = JSON.parse(window.localStorage.getItem(`herbo-cart`))

            const ps1 = [];
            for (const l of notInLocal) {
                ps1.push({...l.product, quantity: l.quantity})
            }

            const updatedData = [...data, ...ps1]

            console.log(updatedData);

            //filtering and adjusting quantities:

            const uniqueDataMap = {};
            const filteredData = [];

            updatedData.forEach((item) => {
                if (!uniqueDataMap[item.id]) {
                    uniqueDataMap[item.id] = true;
                    filteredData.push({ ...item, quantity: 0 });
                }

                const existingItem = filteredData.find((filteredItem) => filteredItem.id === item.id);
                if (existingItem) {
                    existingItem.quantity += item.quantity;
                }
            });

            console.log(filteredData);

            window.localStorage.setItem(`herbo-cart`, JSON.stringify(filteredData));

            setItems(filteredData)

            const cartUpdateEvent = new Event('cartUpdated');
            window.dispatchEvent(cartUpdateEvent);

            /*-----------------------------------------------------------------------------------------------*/

            //populate backend


            const quantityLess = backendItems.filter((backendItem) => items.some((localItem) => backendItem.product.id === localItem.id && (backendItem.quantity < localItem.quantity)));
            const quantityMore = backendItems.filter((backendItem) => items.some((localItem) => backendItem.product.id === localItem.id && (backendItem.quantity > localItem.quantity)));

            console.log("quantityLess", quantityLess)
            console.log("quantityMore", quantityMore)
            if (quantityMore.length !== 0){
                for (let i = 0; i < quantityMore.length; i++) {
                    const updatedItems = items.map((item) =>
                        item.id === quantityMore[i].product.id ? { ...item, quantity: quantityMore[i].quantity } : item
                    );

                    console.log("updatedItems", updatedItems)

                    window.localStorage.setItem(`herbo-cart`, JSON.stringify(updatedItems));

                    setItems(updatedItems);

                    const cartUpdateEvent = new Event('cartUpdated');
                    window.dispatchEvent(cartUpdateEvent);
                }
            }

            if (quantityLess.length !== 0){
                for (let i = 0; i < quantityLess.length; i++) {
                    const corres = items.find((item) => item.id === quantityLess[i].product.id);

                    console.log("corres", corres)

                    for (let j = 0; j < corres.quantity - quantityLess[i].quantity; j++) {
                        axios.post('/api/my/cart/populate', {token: jwt, p: corres.id}, {withCredentials: true})
                            .then(r => {
                                console.log(r.data)
                            })
                            .catch(e => {
                                console.log(e)
                            })
                    }
                }
            }

            const notInBackend = items.filter((localItem) => !backendItems.some((backendItem) => localItem.id === backendItem.product.id));

            console.log("notInBackend", notInBackend)

            for (const notInBackendElement of notInBackend) {
                // console.log(notInBackendElement)
                for (let i = 0; i < notInBackendElement.quantity; i++) {
                    axios.post('/api/my/cart/populate', {token: jwt, p: notInBackendElement.id}, {withCredentials: true})
                        .then(r => {
                            console.log(r.data)
                        })
                        .catch(e => {
                            console.log(e)
                        })
                }
            }

        } else {
            for (const i of items) {
                // console.log(i)
                if(Object.keys(user).length !== 0){
                    axios.post('/api/my/cart/populate', {token: jwt, p: i.id}, {withCredentials: true})
                        .then(r => {
                            console.log(r.data)
                        })
                        .catch(e => {
                            console.log(e.message)
                        })
                }
            }
        }
    }, [backendItems]);

    //effect part 3
    useEffect(() => {
        console.log("update")
    },[items])

    useEffect(() => {
        if(window.localStorage.getItem(`herbo-cart`)){
            setItems(JSON.parse(window.localStorage.getItem(`herbo-cart`)))
        }
    }, [])

    return (
        <>
            <Head>
                <title>My Cart</title>
                <meta name="description" content="Generated by create next app" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main>
                <CartPage cartItems={items} lines={backendItems}/>
            </main>
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

export default Cart;