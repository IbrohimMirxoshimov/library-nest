// decorators/permissions.decorator.ts
import { SetMetadata } from '@nestjs/common';

export const RequirePermissions = (...permissions: number[]) =>
  SetMetadata('permissions', permissions);

export const RequireLocation = (...permissions: number[]) =>
  SetMetadata('loc', permissions);
