// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import axios from "axios";

export default async function handler(req, res) {

    let response = {};

    const { cid } = req.query

    const postedConfig = {
        headers: {
            Authorization: `Bearer ${req.body.jwt}`
        }
    };

    try {
        response = await axios.put(
            `http://nginx/api/edit/category/${cid}`,
            JSON.stringify(req.body.categoryDetails),
            postedConfig
        );
    }
    catch (e) {
        res.status(e.response.status).json(e.response.data);
    }

    res.status(200).json(response.data);
}
