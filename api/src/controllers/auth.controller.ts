import {
	Body,
	Controller,
	Get,
	Post,
	Redirect,
	Req,
	Session,
	UseFilters,
	UseGuards,
	Request as RequestDecorator,
} from "@nestjs/common";
import { AuthService } from "@services/auth.service";
import { SessionGuard } from "@guards/session.guard";
import { AuthGuard } from "@nestjs/passport";
import { Request } from "@src/types/request.d";
import { SessionT } from "@src/types/session";
import { LoggedGuard } from "@guards/logged.guard";
import { antiAuthFilter } from "@filters/antiAuth.filter";
import { SessionGuardFt } from "@guards/sessionFt.guard";
import { DevelopmentGuard } from "@guards/development.guard";
import config from "@config/api.config"

@Controller("auth")
@UseGuards(LoggedGuard)
@UseFilters(antiAuthFilter)
export class AuthController {
	constructor(private authService: AuthService) {}

	// TODO: Move to client
	@Get()
	login(): string {
		return (
			'<form action="auth/42" method="POST">' +
			'<label for="submit1">42 auth</label>' +
			'<input type="submit" id="submit1" value="submit">' +
			" </form>" +
			'<form action="auth/totp" method="POST">' +
			'<label for="totp">totp auth</label>' +
			'<input type="text" name="code" id="totp">' +
			'<input type="submit" id="submit2" value="submit">' +
			" </form>"
		);
	}

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
		ses.user = req.user;
		ses.ftIdentified = Date.now();
		console.log("ses:", ses);
		return req.session;
	}

	/**
	 * Route to validate a session with TOTP
	 * @apiParam {String} code the totp token
	 */
	@Post("totp")
	@Redirect(config.webroot)
	@UseGuards(SessionGuardFt, AuthGuard("totp"))
	totpAuth(@Session() ses: Record<string, any>) {
		ses.totpIdentified = true;
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
