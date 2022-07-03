import { DefaultValuePipe, ParseIntPipe, Query } from "@nestjs/common";
import { RangeValidatorPipe } from "@pipes/range-validator.pipe";

export const Page = () => Query("page", new DefaultValuePipe(1), ParseIntPipe, new RangeValidatorPipe(1));
