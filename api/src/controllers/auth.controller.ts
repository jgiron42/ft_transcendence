import {
	Body,
	Controller,
	Get,
	Post,
	Redirect,
	Req,
	Session,
	UseGuards,
	Request as RequestDecorator,
} from "@nestjs/common";

import { AuthService } from "@services/auth.service";
import { SessionGuard } from "@guards/session.guard";
import { AuthGuard } from "@nestjs/passport";
import type { Request } from "@src/types/request";
import type { SessionT } from "@src/types/session";
import { SessionGuardFt } from "@guards/sessionFt.guard";
import { DevelopmentGuard } from "@guards/development.guard";
import config from "@config/api.config";

@Controller("auth")
export class AuthController {
	constructor(private authService: AuthService) {}

	/**
	 * route to logout a session
	 */
	@Post("logout")
	@UseGuards(...SessionGuard)
	@Redirect(config.webroot)
	logout(@Session() ses: SessionT) {
		this.authService.logout(ses);
	}

	/**
	 * Route to login with the 42 OAuth
	 */
	@Post("42")
	@UseGuards(AuthGuard("42"))
	@Redirect(config.webroot)
	ftAuth() {
		return "not reached";
	}

	/**
	 * Callback for the 42 OAuth
	 */
	@Get("42")
	@UseGuards(AuthGuard("42"))
	@Redirect(config.webroot)
	callback(@Session() ses: Record<string, any>, @Req() req: Request) {
		ses.sessionUser = req.user;
		ses.lastAuthDateFT = Date.now();
		return req.session;
	}

	/**
	 * Route to validate a session with TOTP
	 * @apiParam {String} code the totp token
	 */
	@Post("totp")
	@UseGuards(SessionGuardFt, AuthGuard("totp"))
	totpAuth(@Session() ses: Record<string, any>) {
		ses.isTOTPIdentified = true;
		return ses;
	}

	/**
	 * Route used in development only to set the current session without using the oauth nor totp
	 * @param newSes the new value of session (must be of type SessionT)
	 */
	@Post("session")
	@UseGuards(new DevelopmentGuard())
	setSession(@Body() newSes: SessionT, @RequestDecorator() req: Request) {
		req.session = Object.assign(req.session, newSes);
		return req.session;
	}
}
