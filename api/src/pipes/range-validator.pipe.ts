import { Injectable, PipeTransform } from "@nestjs/common";
import { ValidationError } from "@src/exceptions/validationError.exception";

@Injectable()
export class RangeValidatorPipe implements PipeTransform {
	constructor(private lowerBound: number | undefined, private upperBound?: number | undefined) {}
	transform(value: number): number {
		if (!Number.isSafeInteger(value)) throw new ValidationError(`value must be a safe integer`);
		if (this.lowerBound && this.lowerBound > value)
			throw new ValidationError(`value must be >= ${this.lowerBound}`);
		if (this.upperBound && this.upperBound < value)
			throw new ValidationError(`value must be <= ${this.upperBound}`);
		return value;
	}
}
