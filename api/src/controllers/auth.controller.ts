import { Controller, Get, Post, Redirect, Req, Session, UseFilters, UseGuards } from "@nestjs/common";
import { AuthService } from "@services/auth.service";
import { SessionGuard } from "@guards/session.guard";
import { AuthGuard } from "@nestjs/passport";
import { Request } from "@src/types/request.d";
import { SessionT } from "@src/types/session";
import { LoggedGuard } from "@guards/logged.guard";
import { antiAuthFilter } from "@filters/antiAuth.filter";
import { SessionGuardFt } from "@guards/sessionFt.guard";

@Controller("auth")
@UseGuards(LoggedGuard)
@UseFilters(antiAuthFilter)
export class AuthController {
	constructor(private authService: AuthService) {}

	// TODO: Move to client
	@Get()
	login(): string {
		return (
			'<form action="/auth/42" method="POST">' +
			'<label for="submit1">42 auth</label>' +
			'<input type="submit" id="submit1" value="submit">' +
			" </form>" +
			'<form action="/auth/totp" method="POST">' +
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
	@Redirect("/auth")
	logout(@Session() ses: SessionT) {
		this.authService.logout(ses);
	}

	/**
	 * Route to login with the 42 OAuth
	 */
	@Post("42")
	@UseGuards(AuthGuard("42"))
	@Redirect("/auth")
	ftAuth() {
		return "not reached";
	}

	/**
	 * Callback for the 42 OAuth
	 */
	@Get("42")
	@UseGuards(AuthGuard("42"))
	@Redirect("/auth")
	callback(@Session() ses: Record<string, any>, @Req() req: Request) {
		ses.user = req.user;
		ses.ftIdentified = Date.now();
	}

	/**
	 * Route to validate a session with TOTP
	 * @apiParam {String} code the totp token
	 */
	@Post("totp")
	@Redirect("/auth")
	@UseGuards(SessionGuardFt, AuthGuard("totp"))
	totpAuth(@Session() ses: Record<string, any>) {
		ses.totpIdentified = true;
	}
}
