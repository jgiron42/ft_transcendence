import { Injectable, PipeTransform } from "@nestjs/common";
import { CrudClassFilter } from "@utils/crud-class-filter";
import { Request } from "@src/types/request";

/**
 * pipe adapter for the CrudClassFilter
 */
@Injectable()
export class CrudFilterPipe<T> implements PipeTransform {
	constructor(private accessType: string, private groups?: [string]) {}
	transform(req: Request<T>) {
		req.value = CrudClassFilter(req.value, this.accessType, this.groups);
		return req;
	}
}
