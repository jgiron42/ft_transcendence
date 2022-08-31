import { ArgumentsHost, Catch, ExceptionFilter, Type } from "@nestjs/common";
import { Response } from "express";
import { TokenError } from "passport-oauth2";

@Catch(TokenError as Type)
export class OAuthErrorFilter implements ExceptionFilter {
	catch(_exception: any, host: ArgumentsHost) {
		switch (host.getType()) {
			case "http":
				host.switchToHttp().getResponse<Response>().status(403).send();
				break;
		}
	}
}
