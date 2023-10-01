// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default function handler(req, res) {

  console.log(req)

  res.status(200).json({
    keys: Object.keys(req),
    headers: req.rawHeaders,
    body: req.body
  })
  // res.status(200).json({ headers: JSON.stringify(req.rawHeaders) })
  // res.status(200).json({ name: 'John Doe' })
}
