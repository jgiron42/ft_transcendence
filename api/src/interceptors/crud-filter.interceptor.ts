import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable, map } from "rxjs";
import { CrudClassFilter } from "@utils/crud-class-filter";
import { Request } from "@src/types/request";

@Injectable()
export class CrudFilterInterceptor implements NestInterceptor {
	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		return next.handle().pipe(
			map((data) => {
				// console.log('not filtered',data)
				// console.log('filtered',CrudClassFilter(data, "r"))
				const req: Request = context.switchToHttp().getRequest();
				return CrudClassFilter(data, "r", req.groups) as object;
			}),
		);
	}
}
