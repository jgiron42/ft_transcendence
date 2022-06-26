import { Injectable, PipeTransform } from "@nestjs/common";
import { Request } from "@src/types/request";

/**
 * extract the req.value object of the Request and return it as T
 */
@Injectable()
export class ExtractPayloadPipe<T> implements PipeTransform {
	transform(req: Request<T>): T {
		console.log("req.value = " + JSON.stringify(req.value));
		return req.value;
	}
}
