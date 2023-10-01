// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import axios from "axios";
import {IncomingForm} from "formidable";
import { readFile } from "node:fs/promises"
import { lookup } from "mime-types"

export default async function handler(req, res) {

    let response = {};
    let data = {};

    const token = req.headers.authorization.split(' ')[1];

    const asyncParse = (req) =>
        new Promise((resolve, reject) => {
            const form = new IncomingForm();
            form.parse(req, (err, fields, files) => {
                if (err) return reject(err);
                console.log("files: ", files.file)
                console.log("fields: ", fields)

                resolve({ fields, files });
            });
        });

    const postedConfig = {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": `${req.headers['content-type']}`
        }
    };

    try {

        console.log("headers: ", req.headers)

        if(req.headers.pid){

            console.log("req.headers.pid: ", req.headers.pid)

            response = await asyncParse(req);

            const formData = new FormData()
            const filePath = response.files.file[0].filepath;
            const file = new Blob([await readFile(filePath)], { type: lookup(filePath) });
            formData.append("banner_form[bannerFile]", file, response.files.file[0].originalFilename)

            data = await axios.post(
                `http://nginx/api/new/banner/product/${req.headers.pid}`,
                formData,
                postedConfig
            );
        }
        else if(req.headers.scid){

            response = await asyncParse(req);

            const formData = new FormData()
            const filePath = response.files.file[0].filepath;
            const file = new Blob([await readFile(filePath)], { type: lookup(filePath) });
            formData.append("banner_form[bannerFile]", file, response.files.file[0].originalFilename)

            data = await axios.post(
                `http://nginx/api/new/banner/sub-category/${req.headers.scid}`,
                formData,
                postedConfig
            );
        }
        else{

            response = await asyncParse(req);

            const formData = new FormData()
            const filePath = response.files.file[0].filepath;
            const file = new Blob([await readFile(filePath)], { type: lookup(filePath) });
            formData.append("banner_form[bannerFile]", file, response.files.file[0].originalFilename)

            data = await axios.post(
                `http://nginx/api/new/banner`,
                formData,
                postedConfig
            );

        }

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