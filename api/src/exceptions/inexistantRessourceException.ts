import { BadRequestException } from "@nestjs/common";

export class InexistantRessourceException extends BadRequestException {
	constructor(type: string, value: any) {
		super(`${type} ${JSON.stringify(value)} doesn't exist`);
	}
}
