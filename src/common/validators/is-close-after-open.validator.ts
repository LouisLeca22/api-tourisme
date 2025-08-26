import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'IsCloseAfterOpen', async: false })
export class IsCloseAfterOpenConstraint
  implements ValidatorConstraintInterface
{
  validate(_value: string, args: ValidationArguments): boolean {
    const object = args.object as Record<string, any>;
    if (typeof object.open !== 'string' || typeof object.close !== 'string') {
      return false;
    }

    return this.toMinutes(object.close) > this.toMinutes(object.open);
  }

  private toMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  defaultMessage(): string {
    return "L'heure de fermeture (close) doit être après l'heure d'ouverture (open).";
  }
}

export function IsCloseAfterOpen(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: IsCloseAfterOpenConstraint,
    });
  };
}
