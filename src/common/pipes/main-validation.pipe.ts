import {
  HttpException,
  HttpStatus,
  ValidationError,
  ValidationPipe,
  ValidationPipeOptions,
} from '@nestjs/common';

function errorFormatter(
  errors: ValidationError[],
  errMessage?: any,
  parentField?: string,
): any {
  const message = errMessage || {};
  let errorField = '';
  let validationsList: any[];
  errors.forEach((error) => {
    errorField = parentField
      ? `${parentField}.${error.property}`
      : error?.property;
    if (!error?.constraints && error?.children?.length) {
      errorFormatter(error.children, message, errorField);
    } else {
      // console.log('message', message);

      // console.log('error', JSON.stringify(error, null, 2));

      validationsList = Object.values(error?.constraints || {});

      message[errorField] =
        validationsList.length > 0 ? validationsList.pop() : 'Invalid Value!';
    }
  });
  return message;
}

const validationOptions: ValidationPipeOptions = {
  transform: true,
  whitelist: true,
  errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
  exceptionFactory: (errors: ValidationError[]) =>
    new HttpException(
      {
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: errorFormatter(errors),
      },
      HttpStatus.UNPROCESSABLE_ENTITY,
    ),
};

export const MainValidationPipe = new ValidationPipe(validationOptions);
