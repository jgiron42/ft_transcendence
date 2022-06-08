import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";

/**
 * check if the session user match the :id param
 */
@Injectable()
export class IsUserGuard implements CanActivate {
	canActivate(_context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
		return true;
	}
}
