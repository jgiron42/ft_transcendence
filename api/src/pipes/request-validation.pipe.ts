import { HttpException, Injectable, PipeTransform } from "@nestjs/common";
import { Request } from "@src/types/request";
import { validate } from "class-validator";

/**
 * Validate request data.
 */
@Injectable()
export class RequestValidationPipe<T> implements PipeTransform {
	async transform(req: Request<T>) {
		const res = await validate(req.value as unknown as object);
		res.forEach((err) => {
			throw new HttpException(err.constraints, 400);
		});
		return req;
	}
}
