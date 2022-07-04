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
import { antiAuthFilter } from "@filters/antiAuth.filter";
import { SessionGuardFt } from "@guards/sessionFt.guard";
import { DevelopmentGuard } from "@guards/development.guard";
import config from "@config/api.config";
import { SessionUser } from "@src/types/sessionuser";

@Controller("auth")
@UseFilters(antiAuthFilter)
export class AuthController {
	constructor(private authService: AuthService) {}

	// TODO: Move to client
	@Get()
	login(): string {
		return (
			`<form action="${config.baseUrl}/auth/42" method="POST">` +
			`<label for="submit1">42 auth</label>` +
			`<input type="submit" id="submit1" value="submit">` +
			` </form>` +
			`<form action="${config.baseUrl}/auth/totp" method="POST">` +
			`<label for="totp">totp auth</label>` +
			`<input type="text" name="code" id="totp">` +
			`<input type="submit" id="submit2" value="submit">` +
			` </form>`
		);
	}

	/**
	 * route to logout a session
	 */
	@Post("logout")
	@UseGuards(...SessionGuard)
	@Redirect(`${config.baseUrl}/auth`)
	logout(@Session() ses: SessionT) {
		this.authService.logout(ses);
	}

	/**
	 * Route to login with the 42 OAuth
	 */
	@Post("42")
	@UseGuards(AuthGuard("42"))
	@Redirect(`${config.baseUrl}/auth`)
	ftAuth() {
		return "not reached";
	}

	/**
	 * Callback for the 42 OAuth
	 */
	@Get("42")
	@UseGuards(AuthGuard("42"))
	@Redirect(`${config.baseUrl}/auth`)
	callback(@Session() ses: SessionT, @Req() req: Request) {
		ses.sessionUser = req.user as SessionUser;
		ses.ftIdentified = Date.now();
	}

	/**
	 * Route to validate a session with TOTP
	 * @apiParam {String} code the totp token
	 */
	@Post("totp")
	@Redirect(`${config.baseUrl}/auth`)
	@UseGuards(SessionGuardFt, AuthGuard("totp"))
	totpAuth(@Session() ses: Record<string, any>) {
		ses.totpIdentified = true;
	}

	/**
	 * Route used in development only to set the current session without using the oauth nor totp
	 */
	@Post("session")
	@UseGuards(new DevelopmentGuard())
	setSession(@Body() newSes: SessionT, @RequestDecorator() req: Request) {
		req.session = Object.assign(req.session, newSes);
		return req.session;
	}
}
