import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'IsToAfterFrom', async: false })
export class IsToAfterFromConstraint implements ValidatorConstraintInterface {
  validate(_value: number, args: ValidationArguments): boolean {
    const object = args.object as Record<string, any>;
    return (
      typeof object.from === 'number' &&
      typeof object.to === 'number' &&
      object.to >= object.from
    );
  }

  defaultMessage(): string {
    return '`to` doit être supérieur ou égal à `from`';
  }
}

export function IsToAfterFrom(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: IsToAfterFromConstraint,
    });
  };
}
