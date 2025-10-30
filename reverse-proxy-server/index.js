const express = require("express")
const httpProxy = require("http-proxy")

const app = express()

const BUCKET_NAME = "new-vercel-664" //                             FILL HERE
const BASE_PATH = `https://${BUCKET_NAME}.s3.us-east-1.amazonaws.com/__outputs`

const proxy = httpProxy.createProxy()

app.use((req, res, next) => {
	console.log("->>> ", req.path)
	next()
})

app.use((req, res) => {
	const hostname = req.hostname
	const subdomain = hostname.split(".")[0]
	// const resolvesTo = `${BASE_PATH}/${subdomain}`
	const resolvesTo = `https://connectify-backend-wug2.onrender.com/`
	console.log(subdomain, hostname)

	proxy.web(req, res, { target: resolvesTo, changeOrigin: true })
})


proxy.on("proxyReq", (proxyReq, req, res) => {
	const url = req.url
	if (url === "/") {
		proxyReq.path += "index.html"
	}
})


const port = 8000

app.listen(port, () => {
	console.log("Server started on ", port)
})