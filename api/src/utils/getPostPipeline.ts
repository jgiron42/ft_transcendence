import { ClassConstructor } from "class-transformer";
import { SubstituteNestedPipe } from "@pipes/substitute-nested-pipe.service";
import { CrudFilterPipe } from "@pipes/crud-filter.pipe";
import { ExtractPayloadPipe } from "@pipes/extract-payload.pipe";
import { CastClassPipe } from "@pipes/cast-class.pipe";
import { RequestValidationPipe } from "@src/pipes/request-validation.pipe";

/**
 * return an array containing all pipes needed for handling a post request in api
 * @param cc
 */
export const getPostPipeline = <T>(cc: ClassConstructor<T>) => [
	new CastClassPipe(cc), // extract the body of the request in req.value and cast it as cc class
	new CrudFilterPipe("c"), // filter the class using CrudClassFilter with the "c" (create) access type
	new SubstituteNestedPipe(), // substitute all ids by their corresponding entities (recursively!!!)
	new RequestValidationPipe(),
	new ExtractPayloadPipe<T>(), // extract the req.value object and return it
];
