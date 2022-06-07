import {ClassConstructor} from "class-transformer";
import {DefaultPipe} from "@pipes/default.pipe";
import {SubstituteNestedPipe} from "@pipes/substitute-nested-pipe.service";

/**
 * return an array containing all pipes needed for handling a post request in api
 * @param cc
 */
export function getPostPipe<T>(cc: ClassConstructor<T>)
{
    return [new DefaultPipe(cc), new SubstituteNestedPipe(cc)]
}