import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { Request } from "@src/types/request";

@Injectable()
export class GroupGuard implements CanActivate {
	constructor(private groups: string[]) {}
	canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
		let ret = true;
		for (const g of this.groups) ret &&= context.switchToHttp().getRequest<Request>().groups.includes(g);
		return ret;
	}
}
