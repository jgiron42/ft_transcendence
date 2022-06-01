import {ClassConstructor} from "class-transformer";

export function setFinalType<T>(classType: ClassConstructor<T>)
{
    return Reflect.metadata("ftFinalType", classType);
}

export function setService<T>(classType: ClassConstructor<T>)
{
    return Reflect.metadata("ftTypeService", classType);
}