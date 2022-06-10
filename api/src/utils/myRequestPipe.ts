import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { Request } from "@src/types/request";

export const MyRequestPipe = createParamDecorator((_data: unknown, ctx: ExecutionContext): Request => {
	return ctx.switchToHttp().getRequest<Request>();
});
