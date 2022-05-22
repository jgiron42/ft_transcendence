import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from "@nestjs/common";

import { Request } from "@src/types/request";
import { AuthService } from "@services/auth.service";
import { SessionT } from "@src/types/session";

/**
 * Allows access to the guarded route if the session is NOT logged in
 */
@Injectable()
export class LoggedGuard implements CanActivate {
	constructor(private authservice: AuthService) {}
	canActivate(context: ExecutionContext): boolean {
		// Nest js manipulation to access the underlying express request object
		const req: Request = context.switchToHttp().getRequest();
		// Get the session object in the request
		const ses: SessionT = req.session;
		// Allow access to the page if the user is not authenticated
		if (!this.authservice.isLoggedIn(ses)) {
			return true;
		}
		// Throw an HTTP 401 error
		throw new UnauthorizedException({ statusCode: 401, error: "Unauthorized", reason: "already authenticated" });
	}
}
