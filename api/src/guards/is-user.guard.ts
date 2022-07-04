import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { Request } from "@src/types/request";

/**
 * check if the session user match the :id param
 */
@Injectable()
export class IsUserGuard implements CanActivate {
	canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
		// Nest js manipulation to access the underlying express request object
		const req: Request = context.switchToHttp().getRequest();
		// Get the session in the request
		const ses = req.session;
		return ses.sessionUser.id && ses.sessionUser.id === req?.params?.id;
	}
}
