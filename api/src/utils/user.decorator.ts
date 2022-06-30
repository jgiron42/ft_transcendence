import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { Request } from "@src/types/request";

export const User = createParamDecorator((_data: unknown, ctx: ExecutionContext) => {
	const request: Request = ctx.switchToHttp().getRequest();
	return request.user;
});
