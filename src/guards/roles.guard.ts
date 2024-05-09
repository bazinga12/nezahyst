import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
  } from '@nestjs/common';
  import { AuthGuard } from '@nestjs/passport';
import { UserRole } from 'modules/user';
  
  @Injectable()
  export class RolesGuard extends AuthGuard('jwt') implements CanActivate {
    private requiredRoles = []
    constructor(requiredRoles?:UserRole[]){
      super();
      this.requiredRoles = requiredRoles ?? []
    }

    canActivate(context: ExecutionContext) {
      return super.canActivate(context);
    }
  
    handleRequest(err, user, _info) {
      if (err || !user) {
        throw err || new UnauthorizedException();
      }

      if(user && this.requiredRoles.length > 0 && this.requiredRoles.some(r => r !== user.role)){
        throw new ForbiddenException()
      }
      return user;
    }
  }
  