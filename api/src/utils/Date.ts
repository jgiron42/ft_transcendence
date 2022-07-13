import { Query } from "@nestjs/common";
import { ParseDatePipe } from "@pipes/parse-date.pipe";

export const Date = () => Query("date", ParseDatePipe);
