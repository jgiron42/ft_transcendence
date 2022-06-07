import { Injectable, PipeTransform } from '@nestjs/common';
import {ClassConstructor} from "class-transformer";

/**
 * set all the undefined properties in body to their corresponding values in defaultVal
 */
@Injectable()
export class DefaultPipe<T> implements PipeTransform {
  constructor(private defaultVal: ClassConstructor<T>){}
  transform(value: T) {
    const defaultObject = new this.defaultVal();
    for (const key in defaultObject)
      if (value[key] === undefined)
        value[key] = defaultObject[key]
    return value
  }
}
