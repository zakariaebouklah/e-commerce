// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import axios from "axios";

export default async function handler(req, res) {

    let response = {};

    try {
        response = await axios.post(
            "http://nginx/api/token/refresh",
            JSON.stringify(req.body),
            {
                headers: {
                    "Content-Type": "application/json"
                }
            });
    }
    catch (e) {
        res.status(e.response.status).json(e.response.data);
    }

    res.status(200).json(response.data);
}
