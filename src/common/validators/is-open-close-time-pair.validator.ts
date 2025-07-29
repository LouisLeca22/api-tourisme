import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

interface OpenCloseTimeDto {
  openTwo?: string;
  closeTwo?: string;
}

export function IsOpenCloseTimePair(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isOpenCloseTimePair',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(_value: unknown, args: ValidationArguments) {
          const obj = args.object as OpenCloseTimeDto;

          if (!obj.openTwo && !obj.closeTwo) {
            return true;
          }

          if (obj.openTwo && !obj.closeTwo) {
            return false;
          }

          if (!obj.openTwo && obj.closeTwo) {
            return false;
          }

          if (obj.openTwo && obj.closeTwo) {
            const [openH, openM] = obj.openTwo.split(':').map(Number);
            const [closeH, closeM] = obj.closeTwo.split(':').map(Number);
            const openMinutes = openH * 60 + openM;
            const closeMinutes = closeH * 60 + closeM;
            return closeMinutes > openMinutes;
          }

          return true;
        },
        defaultMessage() {
          return `openTwo et closeTwo forment une paire. Si l'un présent, l'autre aussi`;
        },
      },
    });
  };
}
