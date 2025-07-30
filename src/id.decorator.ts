import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { UserRequest } from './interfaces';

export const Id = createParamDecorator(
  (_data: unknown, context: ExecutionContext): string => {
    let req: UserRequest;

    if (context.getType<'graphql' | 'http'>() === 'graphql') {
      const ctx = GqlExecutionContext.create(context);
      req = ctx.getContext().req as UserRequest;
    } else {
      req = context.switchToHttp().getRequest();
    }

    const id = req.user?.sub;

    if (!id) {
      throw new UnauthorizedException('User ID not found in token');
    }

    return id;
  },
);
