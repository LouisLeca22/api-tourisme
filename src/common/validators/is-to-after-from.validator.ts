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
    return 'La valeur du champ `to` doit être supérieure ou égal à la valeur du champ `from`';
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
