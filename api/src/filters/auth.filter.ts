import { ArgumentsHost, Catch, ExceptionFilter, HttpException, UnauthorizedException } from "@nestjs/common";
import { Response } from "express";
import config from "@config/api.config";

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
		response.redirect(`${config.baseUrl}/auth`);
	}
}
