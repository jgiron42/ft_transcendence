import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable, map } from "rxjs";
import { PaginatedResponse } from "@src/types/paginated-response";
import { Response } from "express";

@Injectable()
export class PaginationInterceptor<T> implements NestInterceptor {
	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		return next.handle().pipe(
			map((data: PaginatedResponse<T>) => {
				if (data && data.page) {
					const res: Response = context.switchToHttp().getResponse();
					res.setHeader("Pagination-Count", data.entities);
					res.setHeader("Pagination-Page", data.page);
					if (data.per_page) res.setHeader("Pagination-Limit", data.per_page);
					return data.data;
				}
				return data;
			}),
		);
	}
}
