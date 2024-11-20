// create-rent.dto.ts
import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsDefined,
  IsISO8601,
  IsObject,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { ClassImplementation } from 'src/utils/type.utils';

export class DateTimeRangeDto
  implements ClassImplementation<Prisma.DateTimeNullableFilter>
{
  @ApiProperty({
    example: new Date().toISOString(),
  })
  @IsISO8601()
  gte: string;

  @ApiProperty({
    example: new Date().toISOString(),
  })
  @IsISO8601()
  lte: string;
}

export const IsDateTimeRange = (required = false) => {
  const optional = required ? IsDefined : IsOptional;

  return applyDecorators(
    ApiProperty({ type: () => DateTimeRangeDto, required }),
    ValidateNested(),
    Type(() => DateTimeRangeDto),
    IsObject(),
    optional(),
  );
};
