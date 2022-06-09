import { Injectable, PipeTransform } from "@nestjs/common";
import { ClassConstructor, plainToInstance } from "class-transformer";
import { Constructable, Container } from "typedi";
import { InexistantRessourceException } from "@src/exceptions/inexistantRessourceException";
import { Request } from "@src/types/request";

interface resourceService<Resource> {
	findOne: (id: string | number) => Promise<Resource>;
}

/**
 * request pipe to substitute all ids in an object by their corresponding entities, the service used to retrieve entities
 * is set by applying the setService decorator on an entity property
 */
@Injectable()
export class SubstituteNestedPipe<T> implements PipeTransform {
	constructor(private ressourceClass: ClassConstructor<T>) {}
	async transform(req: Request): Promise<T> {
		const ressourceCreation = plainToInstance(this.ressourceClass, req.body, {
			excludeExtraneousValues: true,
			exposeUnsetFields: false,
		});
		const ressource = new this.ressourceClass();
		for (const key of Object.keys(ressourceCreation)) {
			if (Reflect.hasMetadata("ftTypeService", ressource, key)) {
				(ressource as unknown as Record<string, T>)[key] = await Container.get<resourceService<T>>(
					Reflect.getMetadata("ftTypeService", ressource, key) as Constructable<resourceService<T>>,
				).findOne((ressourceCreation as any as Record<string, string | number>)[key]);
				if (!(ressource as any as Record<string, T>)[key])
					throw new InexistantRessourceException(
						key,
						(ressourceCreation as any as Record<string, string | number>)[key],
					);
			} else (ressource as Record<string, unknown>)[key] = (ressourceCreation as Record<string, unknown>)[key];
		}
		return ressource;
	}
}
