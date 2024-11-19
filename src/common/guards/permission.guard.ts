import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ReqUser } from 'src/modules/auth/auth.interface';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.get<number[]>(
      'permissions',
      context.getHandler(),
    );

    // If no permissions are required, allow access
    if (!requiredPermissions) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user: ReqUser | undefined = request.user;

    // If no user or role, deny access
    if (!user || !user.roleId || !user.permissions) {
      throw new ForbiddenException('No permission to access this resource');
    }

    const should_location = this.reflector.get<boolean[]>(
      'loc',
      context.getHandler(),
    );

    if (should_location && !user.locationId) {
      throw new BadRequestException('User must be location');
    }

    if (user.locationId) {
      // listlarni olishda default filter object ichiga yoziladi
      if (request.body.filter) {
        request.body.filter.location_id = user.locationId;
      } else {
        request.body.location_id = user.locationId;
      }

      // parametrli zaproslarda ishlashi uchun
      if (request.params) {
        request.params.location_id = user.locationId;
      }
    }

    // Check if user has all required permissions
    const hasAllPermissions = requiredPermissions.every((permission) =>
      user.permissions.includes(permission),
    );

    if (!hasAllPermissions) {
      throw new ForbiddenException('Insufficient permissions');
    }

    return true;
  }
}
