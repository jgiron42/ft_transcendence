import { CanActivate, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";

@Injectable()
export class GameExistGuard implements CanActivate {
	canActivate(): boolean | Promise<boolean> | Observable<boolean> {
		return true;
	}
}
