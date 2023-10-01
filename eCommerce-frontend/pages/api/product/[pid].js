// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import axios from "axios";

export default async function handler(req, res) {

    const { pid } = req.query

    let response = {};

    try {
        response = await axios.get(`http://nginx/products/${pid}`);
    }
    catch (e) {
        res.status(e.code).json(e.data);
    }

    res.status(200).json(response.data);
}
