import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "@services/auth.service";
import { Request } from "@src/types/request";
import { SessionT } from "@src/types/session";
import { WsException } from "@nestjs/websockets";
import { Socket } from "@src/types/socket";

/**
 * Allows access to the guarded route if the session is authenticated with 42 OAuth
 */
@Injectable()
export class SessionGuardFt implements CanActivate {
	constructor(private authService: AuthService) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		let ses: SessionT;
		switch (context.getType()) {
			case "http": {
				// Nest js manipulation to access the underlying express request object
				const req: Request = context.switchToHttp().getRequest<Request>();
				ses = req.session;
				// Allow access if the user is authenticated
				if (this.authService.isFtLogged(ses)) {
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
			case "ws": {
				await this.authService.wsLoadSession(context);
				const socket: Socket = context.switchToWs().getClient<Socket>();
				if (socket.session) {
					if (this.authService.isFtLogged(socket.session)) {
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
