import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const cookie:string=request.cookies['refreshToken']
    const token = this.extractTokenFromHeader(request)
    if (!token ) {
      throw new HttpException('Invalid access token->guard', HttpStatus.UNAUTHORIZED);
    }

    if ( !cookie) {
      throw new HttpException('Invalid refresh token->guard', HttpStatus.UNAUTHORIZED);
    }
    try {
      const payload = this.jwtService.verify(token);
      request['userId'] = payload.userId;
    } catch {
      throw new HttpException('Invalid access token->guard', HttpStatus.UNAUTHORIZED);
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
