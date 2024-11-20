// decorators/permissions.decorator.ts
import { SetMetadata } from '@nestjs/common';

export const RequirePermissions = (...permissions: number[]) =>
  SetMetadata('permissions', permissions);
