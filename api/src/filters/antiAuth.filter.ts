import { ArgumentsHost, Catch, ExceptionFilter, HttpException, UnauthorizedException } from "@nestjs/common";
import { Response } from "express";
import config from "@config/api.config";

/**
 * Redirects a client to the root page when it is authenticated and try accessing the login page
 */
@Catch(UnauthorizedException)
export class antiAuthFilter implements ExceptionFilter {
	catch(_exception: HttpException, host: ArgumentsHost) {
		// Nest js manipulation to access the underlying express response object
		const ctx = host.switchToHttp();
		const response: Response = ctx.getResponse<Response>();
		// Redirect user to the app root
		response.redirect(config.webroot);
	}
}
