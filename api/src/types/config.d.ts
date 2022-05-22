declare module "config.json" {
	export interface Cors {
		origin: string;
	}

	export interface Api {
		port: number;
		cors: Cors;
		sessionTimeout: number;
	}

	const api: Api;
}
