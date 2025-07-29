import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsPriceRange(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isPriceRange',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: string) {
          if (typeof value !== 'string') return false;

          const regex = /^\d{1,5}-\d{1,5}$/;
          if (!regex.test(value)) return false;

          const [min, max] = value.split('-').map(Number);
          return min <= max;
        },
        defaultMessage() {
          return 'Le format du champ "priceRange" doit être du type "min-max", avec des nombres positifs (ex. : "10-30").';
        },
      },
    });
  };
}
