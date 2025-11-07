import express from "express"
import connectDB from "./config/db.js"
import { proxy } from "./middleware/proxy.js"
import { checkProject } from "./middleware/projectChecker.js"
import { errorHandler } from "./middleware/globalErrorHandler.js"

const app = express()


app.use((req, res, next) => {
	console.log("proxy_server - >>> ", req.path)
	next()
})
app.get("/track", (_, res) => {
	res.json({})
})

app.use(checkProject)
app.use(proxy)

app.use(errorHandler);


connectDB()
export default app