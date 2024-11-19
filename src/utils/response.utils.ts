import { NotFoundException } from '@nestjs/common';

export function throwErrorIfNotFound<T>(item: T): T {
  if (!item) {
    throw new NotFoundException();
  }

  return item;
}
