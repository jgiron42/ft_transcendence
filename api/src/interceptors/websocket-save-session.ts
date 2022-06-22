import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
import { Socket } from "@src/types/socket";
import { AuthService } from "@services/auth.service";

@Injectable()
export class WebsocketSaveSession implements NestInterceptor {
	constructor(private authService: AuthService) {}
	async intercept(context: ExecutionContext, next: CallHandler<any>): Promise<Observable<any>> {
		const ret = next.handle();
		const client = context.switchToWs().getClient<Socket>();
		await this.authService.setSession(client.token, client.session);
		return ret;
	}
}
