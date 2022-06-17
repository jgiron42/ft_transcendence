import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common";
// import {TypeORMError} from "typeorm/browser/error/TypeORMError";
import { QueryFailedError } from "typeorm";
import { Response } from "express";

@Catch(QueryFailedError)
export class QueryFailedFilter implements ExceptionFilter {
	catch(exception: QueryFailedError, host: ArgumentsHost) {
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
