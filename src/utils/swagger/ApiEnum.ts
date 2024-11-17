import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { enumEntires } from '../object.utils';

export const ApiEnum = (
  entity: object,
  options: {
    isArray?: boolean;
    type?: any;
    required?: boolean;
  } = {
    isArray: false,
    required: false,
    type: Number,
  },
) => {
  const enums = enumEntires(entity);

  const desc = `<tbody>${enums
    .map((e) => `<div>${e[1]} => ${e[0]}<div>`)
    .join('')}</tbody>`;

  return applyDecorators(
    ApiProperty({
      ...options,
      description: desc,
      example: enums[0][1],
    }),
  );
};
