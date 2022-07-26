import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { Request } from "@src/types/request";
import { User } from "@entities/user.entity";

export const GetUser = createParamDecorator((_data: unknown, ctx: ExecutionContext): User => {
	const request = ctx.switchToHttp().getRequest<Request>();
	return request.session.user;
});
