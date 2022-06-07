import {Injectable, PipeTransform} from "@nestjs/common";
import {ClassConstructor, plainToInstance} from "class-transformer";
import {Container} from "typedi";
import {InexistantRessourceException} from "@src/exceptions/inexistantRessourceException";
import { Request } from "@src/types/request";

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
		let ressource = new this.ressourceClass;
		for (let key of Object.keys(ressourceCreation)) {
			if (Reflect.getMetadata("ftTypeService", ressource, key))
			{
				// @ts-ignore
				(ressource as any)[key] = await Container.get(Reflect.getMetadata("ftTypeService", ressource, key)).findOne(<string>(ressourceCreation as any)[key]);
				if (!(ressource as any)[key])
					throw new InexistantRessourceException(key, <string>(ressourceCreation as any)[key])
			}
			else
				(ressource as any)[key] = (ressourceCreation as any)[key];
		}
		return ressource;
	}
}
