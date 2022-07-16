import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "@services/auth.service";
import { Request } from "@src/types/request";

/**
 * Allows access to the guarded route if the session is validated by TOTP
 */
@Injectable()
export class SessionGuardTOTP implements CanActivate {
	constructor(private authservice: AuthService) {}

	canActivate(context: ExecutionContext): boolean {
		// Nest js manipulation to access the underlying express request object
		const req: Request = context.switchToHttp().getRequest();
		// Allow access if the session is TOTP validated
		if (this.authservice.isTOTPLogged(req)) {
			// Put the user object in the session
			// req.user = req.session.user;
			// Allow access
			return true;
		}
		// Throw an HTTP 401 error
		throw new UnauthorizedException({
			statusCode: 401,
			error: "Unauthorized",
			reason: "not authenticated",
			id: req.session.user.id,
			authMethod: "TOTP",
		});
	}
}
