import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { JwtAccessPayload } from "@repo/types";

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): JwtAccessPayload => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const request = ctx.switchToHttp().getRequest();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return request.user as JwtAccessPayload;
  }
);
