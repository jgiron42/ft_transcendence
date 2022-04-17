// Make TypeScript support process.env with at least NODE_ENV possible keys
declare global {
	namespace NodeJS {
		interface ProcessEnv {
			NODE_ENV: "development" | "production" | "test";
		}
	}
}

export {};
