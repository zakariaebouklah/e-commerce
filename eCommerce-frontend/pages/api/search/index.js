// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import axios from "axios";
import {IncomingForm} from "formidable";

export default async function handler(req, res) {

    let data = {};

    const token = req.headers.authorization.split(' ')[1];

    const postedConfig = {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": `${req.headers['content-type']}`
        }
    };

    let response = {};

    const asyncParse = (req) =>
        new Promise((resolve, reject) => {
            const form = new IncomingForm();
            form.parse(req, (err, fields, files) => {
                if (err) return reject(err);
                console.log("files: ", files)
                console.log("fields: ", fields)

                resolve({ fields, files });
            });
        });

    try {

        response = await asyncParse(req);

        const formData = new FormData()
        formData.append("word", response.fields.word[0])

        data = await axios.post(
            `http://nginx/search`,
            formData,
            postedConfig
        );
    }
    catch (e) {
        res.writeHead(e.httpCode || 400, { 'Content-Type': 'text/plain' });
        res.end(String(e));
    }

    res.status(200).json(data.data);
}

export const config = {
    api: {
        bodyParser: false
    }
};
