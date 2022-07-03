import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "@services/auth.service";
import { Request } from "@src/types/request";
import { UserService } from "@services/user.service";
import { User } from "@entities/user.entity";

/**
 * Allows access to the guarded route if the session is authenticated with 42 OAuth
 */
@Injectable()
export class SessionGuardFt implements CanActivate {
	constructor(private authservice: AuthService, private userService: UserService) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		// Nest js manipulation to access the underlying express request object
		const req: Request = context.switchToHttp().getRequest();
		// Allow access if the user is authenticated
		if (this.authservice.isFtLogged(req.session)) {
			// Put the user object in the session
			req.user = await this.userService.findOne(req.session.user.id);
			if (!req.user) {
				const user = new User();
				user.id = req.session.user.id;
				user.username = req.session.user.firstName ?? req.session.user.id;
				req.user = await this.userService.create(user);
			}
			// Allow access
			return true;
		}
		// Reset totp verification
		req.session.totpIdentified = false;
		// Throw an HTTP 401 error
		throw new UnauthorizedException({
			statusCode: 401,
			error: "Unauthorized",
			reason: "not authenticated",
			authMethod: "42",
		});
	}
}
