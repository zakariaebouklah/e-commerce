// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import axios from "axios";

export default async function handler(req, res) {

    let response = {};

    const { prid } = req.query

    const postedConfig = {
        headers: {
            Authorization: `Bearer ${req.body.jwt}`
        }
    };

    try {
        response = await axios.put(
            `http://nginx/api/edit/promotion/${prid}/product/${req.body.pid}`,
            JSON.stringify(req.body.promoDetails),
            postedConfig
        );
    }
    catch (e) {
        res.status(e.response.status).json(e.response.data);
    }

    res.status(200).json(response.data);
}
