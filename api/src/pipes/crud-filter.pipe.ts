import { Injectable, PipeTransform } from "@nestjs/common";
import { CrudClassFilter } from "@utils/crud-class-filter";
import { Request } from "@src/types/request";

/**
 * pipe adapter for the CrudClassFilter
 */
@Injectable()
export class CrudFilterPipe<T> implements PipeTransform {
	constructor(private accessType: string, private groups?: string[]) {}
	transform(req: Request<T>) {
		let groups: string[] = [];
		if (this.groups) groups = groups.concat(this.groups);
		if (req.groups) groups = groups.concat(req.groups);
		req.value = CrudClassFilter(req.value, this.accessType, groups);
		return req;
	}
}
