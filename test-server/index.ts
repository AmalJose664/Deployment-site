
// server.js
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import router from "./routes/routes";
import { producer } from "./config/kafka";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 4000;
process.env['KAFKAJS_NO_PARTITIONER_WARNING'] = "1"



app.use('/public', express.static(path.join(__dirname, 'public')));

app.use(express.json());
app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
	res.setHeader('Access-Control-Allow-Credentials', 'true');
	next();
});
app.use((req, res, next) => {
	console.log("storage_server -> ", req.path)
	next();
});

app.use(router)

// --------------------------------------------------------------------------------------------


app.listen(port, async () => {
	await producer.connect()
	console.log(`Server is running on http://localhost:${port}`);
});
