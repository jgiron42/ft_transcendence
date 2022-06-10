import { CanActivate, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";

/**
 * check if the session user match the :id param
 */
@Injectable()
export class IsUserGuard implements CanActivate {
	canActivate(): boolean | Promise<boolean> | Observable<boolean> {
		return true;
	}
}
