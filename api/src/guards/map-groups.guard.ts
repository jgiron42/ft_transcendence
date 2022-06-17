import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { requestBinaryPredicate } from "@src/types/binaryPredicate";
import { Request } from "@src/types/request";

@Injectable()
export class MapGroupsGuard implements CanActivate {
	async canActivate(context: ExecutionContext): Promise<boolean> {
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
					if (await mappings[group](req)) req.groups.push(group);
				}
		}
		return true;
	}
}
