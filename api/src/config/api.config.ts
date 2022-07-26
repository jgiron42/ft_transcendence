import * as crypto from "crypto";
const baseURL = process.env.API_BASE_URL || "http://localhost:3000";
const URLsplit = baseURL.split("/");

const config = {
	apiPort: Number(process.env.API_PORT) || 3000,
	env: process.env.NODE_ENV || "development",
	cors: { origin: process.env.API_CORS || "*" },
	sessionTimeout: Number(process.env.API_SESSION_TIMEOUT) || 60000,
	sessionSecret: process.env.API_SESSION_SECRET || crypto.randomBytes(10).toString("hex"),
	baseUrl: baseURL,
	webroot: URLsplit.length >= 3 ? `${URLsplit[0]}/${URLsplit[1]}/${URLsplit[2]}/` : "/",
	itemPerPage: process.env.API_ITEM_PER_PAGE || 10,
	maxItemPerPage: Number(process.env.API_MAX_ITEM_PER_PAGE) || 100,
	uploadsPath: process.env.API_UPLOADS_PATH || "/tmp/uploads", // absolute upload path
};

export default config;
