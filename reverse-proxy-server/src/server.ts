import app from "./app.js";
const PORT = process.env.PORT || 7000;
const startServer = async () => {
	app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
};

startServer().catch((e) => console.log(e));
