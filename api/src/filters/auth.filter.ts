import { ArgumentsHost, Catch, ExceptionFilter, HttpException, UnauthorizedException } from "@nestjs/common";
import config from "@config/api.config";
import { Response } from "express";

/**
 * Redirects a client to the login page when he tries to access an unauthorized page
 */
@Catch(UnauthorizedException)
export class AuthFilter implements ExceptionFilter {
	catch(_exception: HttpException, host: ArgumentsHost) {
		// Nest js manipulation to access the underlying express response object
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();
		// Redirect user to the auth page
		response.redirect(config.webroot);
	}
}
