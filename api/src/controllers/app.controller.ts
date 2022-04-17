import { Controller, Get } from "@nestjs/common";
import config from "@config/api.config";

@Controller()
export class AppController {
	@Get()
	getHealthcheck(): { status: string; env: string; port: number | string } {
		return { status: "live", env: config.env, port: config.apiPort };
	}
}
