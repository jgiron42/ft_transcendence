import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import { Request } from "@src/types/request";
import { ClassConstructor, plainToInstance } from "class-transformer";
import { InvalidField } from "@src/exceptions/InvalidField";
import { Container } from "typedi";

interface resourceService<Resource> {
	findOne: (id: string) => Promise<Resource>;
}

/**
 * edit a resource by finding the previous version id in serviceClass and update it with the body of the request using
 * class-transformer::plainToInstance
 */
@Injectable()
export class EditResourcePipe<T> implements PipeTransform {
	constructor(
		private ressourceClass: ClassConstructor<T>,
		private serviceClass: ClassConstructor<resourceService<T>>,
	) {}
	async transform(req: Request, _metadata: ArgumentMetadata): Promise<T> {
		const service = Container.get(this.serviceClass);
		const id: string = req.params.id;
		if (!id) throw new InvalidField("id", id);
		const ressource: T = await service.findOne(id);
		if (!ressource) throw new BadRequestException(`user ${id} does not exist`);
		const ressourceCreation = plainToInstance(this.ressourceClass, req.body, {
			excludeExtraneousValues: true,
			exposeUnsetFields: false,
		});
		Object.assign(ressource, ressourceCreation);
		return ressource;
	}
}
