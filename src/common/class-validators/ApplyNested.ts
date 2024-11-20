import { applyDecorators } from '@nestjs/common';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ValidateNested, IsObject, IsOptional } from 'class-validator';

export const ApplyNestedOptional = (dto_class: any) => {
  return applyDecorators(
    ApiPropertyOptional({ type: () => dto_class }),
    ValidateNested(),
    Type(() => dto_class),
    IsObject(),
    IsOptional(),
  );
};
