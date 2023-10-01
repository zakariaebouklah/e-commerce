// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import axios from "axios";

export default async function handler(req, res) {

    let response = {};

    try {
        response = await axios.post(
            "http://nginx/register",
            JSON.stringify(req.body));
    }
    catch (e) {
        res.status(e.response.status).json(e.response.data);
    }

    res.status(201).json(response.data);
}
