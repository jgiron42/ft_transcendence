export default {
	apiPort: Number(process.env.API_PORT) || 3000,
	env: process.env.NODE_ENV || "development",
	cors: { origin: process.env.API_CORS || "*" },
	sessionTimeout: Number(process.env.API_SESSION_TIMEOUT) || 60000,
	sessionSecret: process.env.API_SESSION_SECRET.valueOf(),
	baseUrl: process.env.API_BASE_URL || "http://localhost:3000",
};
