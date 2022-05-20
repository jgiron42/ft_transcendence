import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";

declare type RessourceService = {
	findOne: (id: string) => object;
};

@Injectable()
export class RessourceExistGuard<RessourceType extends RessourceService> implements CanActivate {
	constructor(private ressource: RessourceType) {}
	canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		const request = context.switchToHttp().getRequest();
		// eslint-disable-next-line @typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-member-access
		if (this.ressource.findOne(request.params.id)) return true;
		return false;
	}
}
