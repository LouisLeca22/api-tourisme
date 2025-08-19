import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from 'src/auth/constants/auth.constants';
import { Request } from 'express';
import { REQUEST_USER_KEY } from 'src/auth/constants/auth.constants';
import { RoleType } from 'src/auth/enums/role-types.enum';
import { ActiveUserData } from 'src/auth/interfaces/active-user-data.interface';

@Injectable()
export class RolesGuard implements CanActivate {
  private static readonly defaultRoleType = RoleType.User;

  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roleTypes: RoleType[] = this.reflector.getAllAndOverride(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]) ?? [RolesGuard.defaultRoleType];

    const request: Request = context.switchToHttp().getRequest();
    const user = request[REQUEST_USER_KEY] as ActiveUserData;

    if (!user) {
      return true;
    }

    const hierarchy = {
      [RoleType.User]: 1,
      [RoleType.Admin]: 2,
    };

    const minRequiredLevel = Math.min(...roleTypes.map((r) => hierarchy[r]));
    const userLevel = hierarchy[user.role];

    if (userLevel < minRequiredLevel) {
      throw new ForbiddenException("Vous n'avez pas les droits nécessaires");
    }

    return true;
  }
}
