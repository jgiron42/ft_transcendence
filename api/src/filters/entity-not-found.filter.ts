import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common";
// import {TypeORMError} from "typeorm/browser/error/TypeORMError";
import { EntityNotFoundError } from "typeorm";
import { Response } from "express";

@Catch(EntityNotFoundError)
export class EntityNotFoundFilter implements ExceptionFilter {
	catch(exception: EntityNotFoundError, host: ArgumentsHost) {
		switch (host.getType()) {
			case "http":
				host.switchToHttp()
					.getResponse<Response>()
					.status(400)
					.json({
						statusCode: 400,
						error: `${exception.name}: ${exception.message}`,
					});
				break;
		}
	}
}
