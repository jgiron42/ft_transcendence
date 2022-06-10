import { Injectable, PipeTransform } from "@nestjs/common";
import { Constructable, Container } from "typedi";
import { InexistantRessourceException } from "@src/exceptions/inexistantRessourceException";
import { Request } from "@src/types/request";
import { resourceService } from "@src/types/resource-service";

/**
 * request pipe to recursively substitute all ids in an object by their corresponding entities, the service used to retrieve entities
 * is set by applying the setService decorator on an entity property
 */
@Injectable()
export class SubstituteNestedPipe<T> implements PipeTransform {
	async transform(req: Request<T>) {
		for (const key of Object.keys(req.value)) {
			if (Reflect.hasMetadata("ftTypeService", req.value, key)) {
				(req.value as unknown as Record<string, T>)[key] = await Container.get<resourceService<T>>(
					Reflect.getMetadata("ftTypeService", req.value, key) as Constructable<resourceService<T>>,
				).findOne((req.value as Record<string, unknown>)[key]); // TODO stronger typing
				if (!(req.value as Record<string, unknown>)[key])
					throw new InexistantRessourceException(key, (req.value as Record<string, unknown>)[key].toString());
			} else (req.value as Record<string, unknown>)[key] = (req.value as Record<string, unknown>)[key];
		}
		return req;
	}
}
