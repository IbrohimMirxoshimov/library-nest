import { applyDecorators } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger';

export const ApiPrismaIntFilter = (options?: ApiPropertyOptions) => {
  return applyDecorators(
    ApiProperty({
      type: Object,
      description: 'Prisma IntFilter for numeric filtering',
      example: JSON.stringify({ in: [1, 3, 4], gt: 10, lt: 20 }),
      required: false,
      ...(options as any),
    }),
  );
};
