import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';
import { Prisma } from '@prisma/client';

export function IsPrismaIntFilter(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isPrismaIntFilter',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (typeof value === 'number') return true;

          /**
           * TODO_OPTIMIZATION
           * arraysiz yondashuv qilish kerak
           * har bitta key uchun bitta if ochgan holada
           * masalan:
           * if(value['in']) {}
           * va alohida objeytga olish kerak.
           */
          if (typeof value === 'object') {
            // Check for valid Prisma.IntFilter properties
            const validKeys: (keyof Prisma.IntFilter)[] = [
              'in',
              'equals',
              'gt',
              'gte',
              'lt',
              'lte',
              'notIn',
            ];

            const hasValidKeys = Object.keys(value).every((key) =>
              validKeys.includes(key as keyof Prisma.IntFilter),
            );

            // Validate each property type
            const isValidTypes = Object.entries(value).every(([key, val]) => {
              switch (key) {
                case 'equals':
                case 'gt':
                case 'gte':
                case 'lt':
                case 'lte':
                  return typeof val === 'number';
                case 'in':
                case 'notIn':
                  return (
                    Array.isArray(val) &&
                    val.every((v) => typeof v === 'number')
                  );
                // case 'not':
                //   return (
                //     typeof val === 'number' ||
                //     (typeof val === 'object' && val !== null)
                //   );
                default:
                  return false;
              }
            });

            return hasValidKeys && isValidTypes;
          }

          return false;
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a valid Prisma IntFilter`;
        },
      },
    });
  };
}
