import { Injectable, PipeTransform } from "@nestjs/common";

@Injectable()
export class ParseDatePipe implements PipeTransform {
	transform(value: string | undefined): Date | undefined {
		if (value) return new Date(value);
		return undefined;
	}
}
