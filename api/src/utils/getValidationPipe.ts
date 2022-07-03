import { ValidationPipe } from "@nestjs/common";
import { ClassConstructor } from "class-transformer";

/**
 * return a validation pipe with all options set up
 * @param cc
 */
export const getValidationPipe = <T>(cc: ClassConstructor<T>) => {
	const options = {
		whitelist: false,
		expectedType: cc,
	};
	return new ValidationPipe(options);
};
