import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  NotFoundException,
  Type,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { ActiveUserData } from 'src/auth/interfaces/active-user-data.interface';
import { ObjectLiteral, Repository } from 'typeorm';
import { REQUEST_USER_KEY } from 'src/auth/constants/auth.constants';
import { isUUID } from 'class-validator';
import { RoleType } from 'src/auth/enums/role-types.enum';

export function OwnershipGuard<T extends ObjectLiteral>(
  entity: Type<T>,
  relation: keyof T,
): Type<CanActivate> {
  class ResourceOwnershipGuard implements CanActivate {
    constructor(
      @InjectRepository(entity)
      private repo: Repository<T>,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request: Request = context.switchToHttp().getRequest();
      const user = request[REQUEST_USER_KEY] as ActiveUserData;
      const resourceId = request.params.id;

      if (!isUUID(resourceId)) {
        throw new BadRequestException(
          "Format invalide pour l'identifiant (UUID)",
        );
      }

      const resource = await this.repo
        .createQueryBuilder('entity')
        .leftJoinAndSelect(`entity.${String(relation)}`, 'owner')
        .where('entity.id = :id', { id: resourceId })
        .getOne();

      if (!resource) {
        throw new NotFoundException("Cette ressource n'existe pas");
      }

      if (user.role === RoleType.Admin) {
        return true;
      }

      const owner = resource[relation];
      if (!owner || owner.id !== user.sub) {
        throw new ForbiddenException(
          'Seul le propriétaire peut effectuer cette action',
        );
      }

      return true;
    }
  }

  return ResourceOwnershipGuard;
}
