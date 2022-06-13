import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "@services/auth.service";
import { Request } from "@src/types/request";

/**
 * Allows access to the guarded route if the session is authenticated with 42 OAuth
 */
@Injectable()
export class SessionGuardFt implements CanActivate {
	constructor(private authservice: AuthService) {}

	canActivate(context: ExecutionContext): boolean {
		// Nest js manipulation to access the underlying express request object
		const req: Request = context.switchToHttp().getRequest();
		// Get the session in the request
		const ses = req.session;
		// Allow access if the user is authenticated
		if (this.authservice.isFtLogged(ses)) {
			// Put the user object in the session
			req.user = req.session.user;
			// Allow access
			return true;
		}
		// Reset totp verification
		ses.totpIdentified = false;
		// Throw an HTTP 401 error
		throw new UnauthorizedException({
			statusCode: 401,
			error: "Unauthorized",
			reason: "not authenticated",
			authMethod: "42",
		});
	}
}
