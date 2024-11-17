import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ReqUser } from 'src/modules/auth/auth.interface';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

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

    // Check location-based access
    // TODO set location to body
    const locationId = this.getLocationIdFromRequest(context);
    if (locationId && user.locationId) {
      if (user.locationId !== locationId) {
        throw new ForbiddenException(
          'No permission to access this library location',
        );
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

  private getLocationIdFromRequest(context: ExecutionContext): number | null {
    const request = context.switchToHttp().getRequest();

    // Try to get location_id from request params
    if (request.params && request.params.location_id) {
      return parseInt(request.params.location_id, 10);
    }

    // Try to get location_id from request body
    if (request.body && request.body.location_id) {
      return parseInt(request.body.location_id, 10);
    }

    // Try to get location_id from query params
    if (request.query && request.query.location_id) {
      return parseInt(request.query.location_id, 10);
    }

    return null;
  }
}
