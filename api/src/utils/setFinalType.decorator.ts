import { ClassConstructor } from "class-transformer";

/**
 * set the service metadata for later substitution by SubstituteNestedPipe
 * @param service the service class used to retrieve the entity
 */
export const setService = <T>(service: ClassConstructor<T>) => Reflect.metadata("ftTypeService", service);
