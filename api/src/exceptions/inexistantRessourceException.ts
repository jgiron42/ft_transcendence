import { BadRequestException } from "@nestjs/common";

export class InexistantRessourceException extends BadRequestException {
	constructor(type: string, value: string) {
		super(`${type} ${value} doesn't exist`);
	}
}
