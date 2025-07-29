import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateOwnerDto {
  @ApiProperty({
    description: 'Nom du propriétaire',
    example: 'Montagne Aventur',
  })
  @IsString({ message: 'Le nom doit être une chaîne de caractère' })
  @IsNotEmpty({ message: 'Le nom est obligatoire' })
  @MinLength(3, { message: 'Le nom doit contenir au moins 3 caractères' })
  @MaxLength(96, {
    message: 'Le nom doit contenir au maximum 96 caractères',
  })
  name: string;

  @ApiProperty({
    description: 'Adresse e-mail du propriétaire',
    example: 'info@montagneaventure.fr',
  })
  @MaxLength(96, {
    message: "L'email doit contenir au maximum 96 caractères",
  })
  @IsEmail({}, { message: 'Adresse e-mail invalide' })
  @IsNotEmpty({ message: 'Adresse e-mail est obligatoire' })
  email: string;

  @ApiProperty({
    description:
      'Mot de passe du propriétaire - (8 caractères, 1 majuscule, 1 chiffre, 1 caractère spécial)',
    example: 'Montagne1234!',
  })
  @IsString({ message: 'Le mot de passe doit être une chaîne de caractère' })
  @IsNotEmpty({ message: 'Le mot de passe est obligatoire ' })
  @MinLength(8, {
    message: 'Le mot de passe doit contenir au moins 8 caractères',
  })
  @MaxLength(255, {
    message: 'Le not de passe doit contenir au maximum 255 caractères',
  })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, {
    message:
      'Le mot de passe doit contenir au moins une lettre, au moins un nombre et au moins un caractère spécial',
  })
  password: string;

  @ApiPropertyOptional({
    description:
      'Numéro de téléphone du propriétaire - (06XXXXXXXX ou +336XXXXXXXX)',
    example: '+33 4 79 55 12 34',
  })
  @IsString({
    message: 'Le numéro de téléphone doit être une chaîne de caractère',
  })
  @MaxLength(20, {
    message: 'Le numéro de téléphone doit contenir au maximum 20 caractères',
  })
  @IsOptional()
  @Matches(/^(\+33|0)[1-9](\d{2}){4}$/, {
    message:
      'Le numéro de téléphone doit être un numéro français valide (ex. 06XXXXXXXX ou +336XXXXXXXX).',
  })
  phoneNumber?: string;

  @ApiPropertyOptional({
    description: 'https://montagneaventure.fr',
    example: '+33 4 79 55 12 34',
  })
  @IsOptional()
  @MaxLength(2083, {
    message: "L'URL doit contenir au maximum 2083 caractères",
  })
  @IsUrl({}, { message: 'Le site web doit être un URL valide' })
  websiteUrl?: string;
}
