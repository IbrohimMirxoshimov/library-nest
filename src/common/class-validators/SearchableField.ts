import { applyDecorators } from '@nestjs/common';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmptyObject, ValidationOptions } from 'class-validator';

export const SearchableField =
  (validationOptions?: ValidationOptions) =>
  (target: any, propertyKey: string | symbol) =>
    applyDecorators(
      ApiPropertyOptional({
        description:
          'Case-insensitive search will be performed, records are selected if they contain given input',
        type: String,
      }),
      Transform(({ value }) => {
        // validate initial input type manually
        if (!value || typeof value !== 'string') return {};
        return {
          contains: value,
          mode: 'insensitive',
        };
      }),
      // empty object is received after transformation if initial type was invalid
      IsNotEmptyObject(
        {},
        {
          message:
            validationOptions?.message ||
            `${String(propertyKey)} must be a string`,
        },
      ),
    )(target, propertyKey);
