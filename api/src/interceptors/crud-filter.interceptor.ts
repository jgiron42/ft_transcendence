import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable, map } from "rxjs";
import { CrudClassFilter } from "@utils/crud-class-filter";

@Injectable()
export class CrudFilterInterceptor implements NestInterceptor {
	intercept(_context: ExecutionContext, next: CallHandler): Observable<any> {
		return next.handle().pipe(
			map((data) => {
				// console.log('not filtered',data)
				// console.log('filtered',CrudClassFilter(data, "r"))
				return CrudClassFilter(data, "r") as object;
			}),
		);
	}
}
