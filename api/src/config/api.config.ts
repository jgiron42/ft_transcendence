import config from "config.json";

const apiConfig = config.api || ({} as config.Api);

export default {
	apiPort: apiConfig.port || 3000,
	env: process.env.NODE_ENV || "development",
	cors: apiConfig.cors || { origin: "*" },
};
