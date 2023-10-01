// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import axios from "axios";

export default async function handler(req, res) {

    let response = {};

    const { rid } = req.query

    const postedConfig = {
        headers: {
            Authorization: `Bearer ${req.body.token}`
        }
    };

    try {
        response = await axios.delete(
            `http://nginx/api/delete/review/${rid}/product/${req.body.pid}`,
            postedConfig
        );
    }
    catch (e) {
        res.status(e.response.status).json(e.response.data);
    }

    res.status(200).json(response.data);
}
