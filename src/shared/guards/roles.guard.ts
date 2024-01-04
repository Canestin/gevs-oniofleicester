import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {
  InjectRolesBuilder,
  RolesBuilder,
  IQueryInfo,
} from 'nest-access-control';
import { Admin } from '../../gevs/entities/admin.entity';
import { Voter } from '../../voter/entities/voter.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @InjectRolesBuilder()
    private roleBuilder: RolesBuilder,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles: IQueryInfo[] = this.reflector.get(
      'roles',
      context.getHandler(),
    );
    if (!roles) {
      return true;
    }

    /**
     * If there are roles, they must have either 'any' or 'own' permission
     * 1 : If roles have 'any' and logged in user has 'any' permission,
     *     Access granted
     * 2 : If roles have 'own' and logged in user had 'own' permission,
     *     check if id found in params or query, then grant access
     */

    /** Get Request */
    const request = await context.switchToHttp().getRequest();
    const user = request.user;
    const userRoles = user.roles;

    /** Check for users with an 'any' permission */
    const hasAnyAccess = !!roles
      .filter((role) => role.possession === 'any')
      .find((role) => {
        // no allowed role has an 'any' access
        // for 'any' access roles, check if user has it
        const queryInfo = role;
        queryInfo.role = userRoles;
        const permission = this.roleBuilder.permission(queryInfo);
        return permission.granted;
      });

    /** Grant access to users who have an 'any' allowed permission */
    if (hasAnyAccess) return true;

    /** Check for users with an 'own' allowed permission */
    const hasOwnRoles = !!roles
      .filter((role) => role.possession === 'own')
      .find((role) => {
        // for 'own' access roles, check if user has it
        const queryInfo = role;
        queryInfo.role = userRoles;
        const permission = this.roleBuilder.permission(queryInfo);
        return permission.granted;
      });

    /**
     * If user have 'own' possession,
     * must check if its id is in params
     * or query string
     */
    if (!hasOwnRoles) return false;

    let hasOwnAccess = user.id === request.params.userId;
    if (user instanceof Voter) {
      hasOwnAccess =
        hasOwnAccess ||
        user.id === request.params.voterId ||
        user.id === request.query.voterId ||
        user.id === request.body.voterId;
    }
    if (user instanceof Admin) {
      hasOwnAccess =
        hasOwnAccess ||
        user.id === request.params.adminId ||
        user.id === request.query.adminId ||
        user.id === request.body.adminId;
    }

    return hasOwnAccess;
  }
}
