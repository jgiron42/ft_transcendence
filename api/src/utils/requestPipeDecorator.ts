import {createParamDecorator, ExecutionContext} from "@nestjs/common";

export const RequestPipeDecorator = createParamDecorator(
	(_data: unknown, ctx: ExecutionContext) => {
		return ctx.switchToHttp().getRequest();
	});
