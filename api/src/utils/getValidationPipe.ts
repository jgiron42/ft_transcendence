import {ValidationPipe} from "@nestjs/common";
import {ClassConstructor} from "class-transformer";

export function getValidationPipe<T>(cc: ClassConstructor<T>)
{
    const options = {
        whitelist: true,
        transform: true,
        expectedType: cc,
        transformOptions: {
            excludeExtraneousValues: true,
            exposeUnsetFields: false
        }
    }
    return new ValidationPipe(options)
}