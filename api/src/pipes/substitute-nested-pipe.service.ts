import { Injectable, PipeTransform } from "@nestjs/common";
import { ClassConstructor, plainToInstance } from "class-transformer";
import { Container } from "typedi";
import { InexistantRessourceException } from "@src/exceptions/inexistantRessourceException";
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
		const ressource = new this.ressourceClass();
		for (const key of Object.keys(ressourceCreation)) {
			if (Reflect.getMetadata("ftTypeService", ressource, key)) {
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-call,@typescript-eslint/ban-ts-comment
				(ressource as any)[key] = await Container.get(
					// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
					Reflect.getMetadata("ftTypeService", ressource, key),
					// eslint-disable-next-line @typescript-eslint/consistent-type-assertions,@typescript-eslint/ban-ts-comment
					// @ts-ignore
					// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/consistent-type-assertions
				).findOne(<string>(ressourceCreation as any)[key]);
				// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
				if (!(ressource as any)[key])
					// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/consistent-type-assertions
					throw new InexistantRessourceException(key, <string>(ressourceCreation as any)[key]);
				// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
			} else (ressource as any)[key] = (ressourceCreation as any)[key];
		}
		return ressource;
	}
}
