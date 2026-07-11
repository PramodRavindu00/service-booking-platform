import { BadRequestException, ValidationError } from '@nestjs/common';

export type FieldErrors = Record<string, string[]>;

export function mapValidationErrors(
  errors: ValidationError[],
  parent = '',
): FieldErrors {
  return errors.reduce<FieldErrors>((acc, error) => {
    const field = parent ? `${parent}.${error.property}` : error.property;

    if (error.constraints) {
      const messages = Object.values(error.constraints);
      acc[field] = acc[field] ? [...acc[field], ...messages] : messages;
    }

    if (error.children?.length) {
      const nested = mapValidationErrors(error.children, field);
      for (const [key, messages] of Object.entries(nested)) {
        acc[key] = acc[key] ? [...acc[key], ...messages] : messages;
      }
    }

    return acc;
  }, {});
}

export function validationExceptionFactory(errors: ValidationError[]) {
  return new BadRequestException({
    status: 400,
    errors: mapValidationErrors(errors),
  });
}
