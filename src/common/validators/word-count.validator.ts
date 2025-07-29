import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function WordCount(
  min: number,
  max: number,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'WordCount',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [min, max],
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (typeof value !== 'string') return false;
          const wordCount = value.trim().split(/\s+/).length;
          const [min, max] = args.constraints as [number, number];
          return wordCount >= min && wordCount <= max;
        },
        defaultMessage(args: ValidationArguments) {
          const [min, max] = args.constraints as [number, number];
          return `La description doit contenir entre ${min} et ${max} mots`;
        },
      },
    });
  };
}
