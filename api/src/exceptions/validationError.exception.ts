import { BadRequestException } from "@nestjs/common";

export class ValidationError extends BadRequestException {
	constructor(error: string) {
		super(error);
	}
}
