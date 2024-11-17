import {
  createParamDecorator,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { ReqUser } from '../../modules/auth/auth.interface';
import { Request } from 'express';

export const CurrentUser = createParamDecorator(
  (data: keyof ReqUser | undefined, ctx: ExecutionContext) => {
    const request: Request = ctx.switchToHttp().getRequest();
    const user: ReqUser | undefined = request.user as any;
    if (user) {
      return data ? user?.[data] : user;
    }

    throw new ForbiddenException();
  },
);

export const UserLocation = createParamDecorator((ctx: ExecutionContext) => {
  const request: Request = ctx.switchToHttp().getRequest();
  const user: ReqUser | undefined = request.user as any;

  if (user) {
    return user.locationId;
  }

  throw new ForbiddenException();
});
