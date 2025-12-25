import express from "express"
import connectDB from "./config/mongo.config.js"
import { proxy } from "./middleware/proxy.js"
import { checkProject } from "./middleware/projectChecker.js"
import { errorHandler } from "./middleware/globalErrorHandler.js"
import extraRoute from "./routes/routes.js"

const app = express()


app.use((req, res, next) => {
	console.log("proxy_server - >>> ", req.path)
	next()
})

app.use("/extras", extraRoute)
app.use(checkProject)
app.use(proxy)

app.use(errorHandler);


connectDB()
export default app