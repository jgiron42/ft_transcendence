import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "@services/auth.service";
import { Request } from "@src/types/request";
import { Socket } from "@src/types/socket";
import { WsException } from "@nestjs/websockets";

/**
 * Allows access to the guarded route if the session is validated by TOTP
 */
@Injectable()
export class SessionGuardTOTP implements CanActivate {
	constructor(private authService: AuthService) {}

	canActivate(context: ExecutionContext): boolean {
		switch (context.getType()) {
			case "http": {
				// Nest js manipulation to access the underlying express request object
				const req: Request = context.switchToHttp().getRequest();
				// Allow access if the session is TOTP validated
				if (this.authService.isTOTPLogged(req.session)) {
					// Allow access
					return true;
				}
				// Throw an HTTP 401 error
				throw new UnauthorizedException({
					statusCode: 401,
					error: "Unauthorized",
					reason: "not authenticated",
					authMethod: "TOTP",
				});
			}
			case "ws": {
				const socket: Socket = context.switchToWs().getClient<Socket>();
				if (socket.session && this.authService.isTOTPLogged(socket.session)) {
					return true;
				}
				throw new WsException({
					error: "Unauthorized",
					reason: "not authenticated",
					authMethod: "TOTP",
				});
			}
			default:
				throw new Error(`Fatal: executionContext type ${context.getType()} is not supported`);
		}
	}
}
