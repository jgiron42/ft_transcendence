import { ExposeOptions } from "class-transformer/types/interfaces";
import { Exclude, Expose } from "class-transformer";

/**
 * decorator used to set authorization for access to an entity properties in the api
 */
export const SetMode = (mode: string, options?: ExposeOptions): PropertyDecorator & ClassDecorator => {
	if (!options) options = {};
	options.toClassOnly = false;
	options.toPlainOnly = false;
	switch (mode) {
		case "r":
			options.toPlainOnly = true;
			break;
		case "w":
			options.toClassOnly = true;
			break;
		case "rw":
		case "wr":
			break;
		case "":
			return Exclude();
		default:
			// eslint-disable-next-line no-throw-literal
			throw "Invalid argument for SetMode decorator";
	}
	return Expose(options);
};
