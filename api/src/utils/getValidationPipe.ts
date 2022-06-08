import { ValidationPipe } from "@nestjs/common";
import { ClassConstructor } from "class-transformer";

/**
 * return a validation pipe with all options set up
 * @param cc
 */
export const getValidationPipe = <T>(cc: ClassConstructor<T>) => {
	const options = {
		whitelist: true,
		transform: true,
		expectedType: cc,
		transformOptions: {
			excludeExtraneousValues: true,
			exposeUnsetFields: false,
		},
	};
	return new ValidationPipe(options);
};
