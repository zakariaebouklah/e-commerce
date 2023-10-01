// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import axios from "axios";

export default async function handler(req, res) {

    let response = {};

    const postedConfig = {
        headers: {
            "Content-Type": "application/json"
        }
    };

    try {
        response = await axios.post(
            `http://nginx/connect/oauth/check`,
            JSON.stringify(req.body.oauthData),
            postedConfig
        );
    }
    catch (e) {
        res.status(e.response.status).json(e.response.data);
    }

    res.status(200).json(response.data);
}
