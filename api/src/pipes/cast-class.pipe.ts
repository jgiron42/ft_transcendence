import { Injectable, PipeTransform } from "@nestjs/common";
import { Request } from "@src/types/request";
import { ClassConstructor } from "class-transformer";

/**
 * cast the req.body object into ressourceClass and load it in req.value
 */
@Injectable()
export class CastClassPipe<T> implements PipeTransform {
	constructor(private ressourceClass: ClassConstructor<T>) {}
	transform(req: Request<T>): Request<T> {
		const ret = new this.ressourceClass();
		for (const key in ret) if (Object.prototype.hasOwnProperty.call(ret, key)) delete ret[key];
		req.value = Object.assign<T, object>(ret, req.body as object);
		return req;
	}
}
