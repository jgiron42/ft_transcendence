import { BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import { ClassConstructor } from "class-transformer";
import { Request } from "@src/types/request";
import { Container } from "typedi";
import { InvalidField } from "@src/exceptions/InvalidField";
import { resourceService } from "@src/types/resource-service";

/**
 * replace all the unset fields in req.value by their corresponding value in the previous version of the entity
 */
@Injectable()
export class InjectPreviousPipe<T> implements PipeTransform {
	constructor(private serviceClass: ClassConstructor<resourceService<T>>) {}
	async transform(req: Request<T>): Promise<Request<T>> {
		const service = Container.get(this.serviceClass);
		const id: string = req.params.id;
		if (!id) throw new InvalidField("id", id);
		const resource: T = await service.findOne(id);
		if (!resource) throw new BadRequestException(`resource ${id} does not exist`);
		for (const key in resource)
			if (Object.prototype.hasOwnProperty.call(resource, key)) req.value[key] ??= resource[key];
		return req;
	}
}
