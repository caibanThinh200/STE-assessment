// user.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from './user.schema';

export interface VerifyUser {
  sub: string;
  email: string;
}

export const CurrentUser = createParamDecorator(
  (data: User, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user as VerifyUser; // Assuming the user object is attached to the request
  },
);
