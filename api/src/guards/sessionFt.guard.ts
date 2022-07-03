import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "@services/auth.service";
import { Request } from "@src/types/request";
import { UserService } from "@services/user.service";
import { User } from "@entities/user.entity";
import { WsException } from "@nestjs/websockets";
import { Socket } from "@src/types/socket";

/**
 * Allows access to the guarded route if the session is authenticated with 42 OAuth
 */
@Injectable()
export class SessionGuardFt implements CanActivate {
	constructor(private authService: AuthService, private userService: UserService) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		switch (context.getType()) {
			case "http": {
				// Nest js manipulation to access the underlying express request object
				const req: Request = context.switchToHttp().getRequest();
				// Allow access if the user is authenticated
				if (this.authService.isFtLogged(req.session)) {
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
			case "ws": {
				await this.authService.wsLoadSession(context);
				const socket: Socket = context.switchToWs().getClient<Socket>();
				if (socket.session) {
					if (this.authService.isFtLogged(socket.session)) {
						if (!(await this.userService.findOne(socket.session.user.id))) {
							const user = new User();
							user.id = socket.session.user.id;
							user.username = socket.session.user.firstName ?? socket.session.user.id;
							socket.user = await this.userService.create(user);
						}
						return true;
					}
					socket.session.totpIdentified = false;
				}
				throw new WsException({
					error: "Unauthorized",
					reason: "not authenticated",
					authMethod: "42",
				});
			}
			default:
				throw new Error(`Fatal: executionContext type ${context.getType()} is not supported`);
		}
	}
}
