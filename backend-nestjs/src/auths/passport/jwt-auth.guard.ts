import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY, IS_PUBLIC_OPTIONAL_KEY } from '../decorator/customize';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const isPublicOptional = this.reflector.getAllAndOverride<boolean>(
      IS_PUBLIC_OPTIONAL_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (isPublic) {
      return true;
    }

    if (isPublicOptional) {
      // Cho phép truy cập nhưng vẫn cố gắng validate token
      return this.validateOptional(context);
    }

    return super.canActivate(context);
  }

  async validateOptional(context: ExecutionContext): Promise<boolean> {
    try {
      await super.canActivate(context);
    } catch (error) {
      //ignore err
    }
    return true;
  }

  handleRequest(err, user, info, context) {
    const isPublicOptional = this.reflector.getAllAndOverride<boolean>(
      IS_PUBLIC_OPTIONAL_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (isPublicOptional) {
      return user || null;
    }

    if (err || !user) {
      throw (
        err ||
        new UnauthorizedException(
          'access_token không hợp lệ hoặc không tồn tại ở header',
        )
      );
    }
    return user;
  }
}
