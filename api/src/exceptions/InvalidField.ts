import { BadRequestException } from "@nestjs/common";

export class InvalidField extends BadRequestException {
	constructor(field: string, value: any) {
		super(`Invalid value ${JSON.stringify(value)} for field ${field}`);
	}
}
