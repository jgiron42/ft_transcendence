import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { requestBinaryPredicate } from "@src/types/binaryPredicate";
import { Request } from "@src/types/request";

@Injectable()
export class MapGroupsGuard implements CanActivate {
	canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
		if (context.getType() !== "http") return true;
		if (Reflect.hasMetadata("groupMapper", context.getClass())) {
			const mappings = Reflect.getMetadata("groupMapper", context.getClass()) as Record<
				string,
				requestBinaryPredicate
			>;
			const req: Request = context.switchToHttp().getRequest();
			for (const group in mappings)
				if (Object.prototype.hasOwnProperty.call(mappings, group)) {
					req.groups ??= [];
					if (mappings[group](req)) req.groups.push(group);
				}
		}
		return true;
	}
}
