import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
import { requestBinaryPredicate } from "@src/types/binaryPredicate";
import { Request } from "@src/types/request";

/**
 * add group to the request's groups if predicate evaluate to true when applied to the request
 * @Param group the group to add
 * @Param requestBinaryPredicate the predicate used to test if a request belong to the group
 */
@Injectable()
export class MapGroupInterceptor implements NestInterceptor {
	constructor(private group: string, private predicate: requestBinaryPredicate) {}
	async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
		const req: Request = context.switchToHttp().getRequest();
		req.groups ??= [];
		if (await this.predicate(req)) req.groups.push(this.group);
		return next.handle();
	}
}
