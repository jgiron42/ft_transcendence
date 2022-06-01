import {ClassConstructor} from "class-transformer";
import {DefaultPipe} from "@pipes/default.pipe";
import {SubstituteNestedPipe} from "@pipes/substitute-nested-pipe.service";

export function getPostPipe<T>(cc: ClassConstructor<T>)
{
    return [new DefaultPipe(new cc), new SubstituteNestedPipe(cc)]
}