import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common";
// import {TypeORMError} from "typeorm/browser/error/TypeORMError";
import { TypeORMError } from "typeorm";
import { Response } from "express";

@Catch(TypeORMError)
export class TypeormErrorFilter implements ExceptionFilter {
	catch(exception: TypeORMError, host: ArgumentsHost) {
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
