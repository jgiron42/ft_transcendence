import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Request } from "@src/types/request";
import { Observable } from "rxjs";

const getFlag = (context: ExecutionContext): string => {
	switch (context.switchToHttp().getRequest<Request>().method) {
		case "POST":
			return "c";
		case "GET":
			return "r";
		case "PUT":
			return "u";
		case "DELETE":
			return "d";
		default:
			return "";
	}
};

@Injectable()
export class MethodGuard<T> implements CanActivate {
	constructor(private entity: T) {}
	canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
		const mode: Map<string, string> = Reflect.getMetadata("crudFilter", this.entity) as Map<string, string>;
		const type: string = getFlag(context);
		for (const group in mode)
			if (Object.prototype.hasOwnProperty.call(mode, group)) {
				if (
					context.switchToHttp().getRequest<Request>().groups.includes(mode.get(group)) &&
					mode.get(group).includes(type)
				)
					return true;
			}
		return false;
	}
}
