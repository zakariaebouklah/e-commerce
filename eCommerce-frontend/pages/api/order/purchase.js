// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import axios from "axios";

export default async function handlePurchase(req, res) {

    let response = {};

    const postedConfig = {
        headers: {
            Authorization: `Bearer ${req.body.jwt}`
        }
    };

    try {
        response = req.body.couponCode ?
            await axios.post(
            `http://nginx/api/purchase/order`,
            JSON.stringify({code: req.body.couponCode}),
            postedConfig)
            :
            await axios.post(
                `http://nginx/api/purchase/order`,
                null,
                postedConfig);
    }
    catch (e) {
        res.status(e.response.status).json(e.response.data);
    }

    res.status(200).json(response.data);
}
