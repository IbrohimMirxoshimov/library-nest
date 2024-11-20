import { registerDecorator, ValidationOptions } from 'class-validator';

export function isUzbPhoneNumber(value: any) {
  return typeof value === 'string' && Boolean(value.match(/^998\d{9}$/));
}

export function IsUzbPhoneNumber(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isUzbPhoneNumber',
      target: object.constructor,
      propertyName: propertyName,
      options: {
        ...validationOptions,
        message: 'invalid',
      },
      validator: {
        validate: isUzbPhoneNumber,
      },
    });
  };
}
