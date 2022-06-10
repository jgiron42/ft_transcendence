import { Injectable, PipeTransform } from "@nestjs/common";
import { ClassConstructor } from "class-transformer";
import { Request } from "@src/types/request";

/**
 * set all the undefined properties in body to their corresponding values in defaultVal
 */
@Injectable()
export class InjectDefaultPipe<T> implements PipeTransform {
	constructor(private defaultVal: ClassConstructor<T>) {}
	transform(req: Request<T>) {
		const defaultObject = new this.defaultVal();
		for (const key in defaultObject)
			if (Object.prototype.hasOwnProperty.call(defaultObject, key)) req.value[key] ??= defaultObject[key];
		return req;
	}
}
