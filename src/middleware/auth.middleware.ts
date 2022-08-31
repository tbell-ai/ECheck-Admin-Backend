import { ForbiddenException, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import { jwtConstants } from '../auth/constants';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (req.user) {
      next();
      return;
    }

    // console.log(req);

    const accessToken = req.cookies.LOGIN_TOKEN;
    let user;
    try {
      user = verify(accessToken, jwtConstants.secret);
    } catch (error) {
      throw new ForbiddenException(
        '해당 기능에 접근할 수 있는 권한이 없습니다.',
      );
    }

    if (user) {
      req.user = user;
    }
    next();
  }
}
