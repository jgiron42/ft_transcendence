import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { Request } from "@src/types/request";

declare type RessourceService = {
	findOne: (id: string) => object;
};

@Injectable()
export class RessourceExistGuard<RessourceType extends RessourceService> implements CanActivate {
	constructor(private ressource: RessourceType) {}
	canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
		const request = context.switchToHttp().getRequest<Request>();
		if (this.ressource.findOne(request.params.id)) return true;
		return false;
	}
}
