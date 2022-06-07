import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const RequestPipeDecorator = createParamDecorator((_data: unknown, ctx: ExecutionContext) => {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-return
	return ctx.switchToHttp().getRequest();
});
