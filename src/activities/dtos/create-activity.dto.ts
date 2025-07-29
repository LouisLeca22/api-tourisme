import {
  ArrayNotEmpty,
  IsArray,
  IsEnum,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { WordCount } from 'src/common/validators/word-count.validator';

import { IsPriceRange } from 'src/common/validators/price-range.validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsToAfterFrom } from 'src/common/validators/is-to-after-from.validator';
import { IsCloseAfterOpen } from 'src/common/validators/is-close-after-open.validator';
import { ActivityType } from '../enums/activity-type.enum';
import { Language, LANGUAGES } from 'src/common/constants/languages.constants';

export class CreateActivityDto {
  @ApiProperty({
    description: 'identifiant du propriétaire (UUID)',
    example: '11926678-5ef5-4ea7-bda9-759e64ee29e3',
  })
  @IsNotEmpty()
  @IsUUID()
  ownerId: string;

  @ApiProperty({
    description: "Nom de l'activité",
    example: 'Balade en paddle dans la baie',
  })
  @IsNotEmpty({ message: 'Le champ "name" est obligatoire' })
  @IsString({ message: 'Le nom doit être une chaîne de caractère' })
  @MinLength(3, { message: 'Le nom doit contenir au moins 3 caractères' })
  @MaxLength(96, {
    message: 'Le nom doit contenir au maximum 96 caractères',
  })
  name: string;

  @ApiProperty({
    description: "Description de l'activité",
    example: 'Charmante villa avec jardin et piscine.',
  })
  @IsNotEmpty({ message: 'Le champ "description" est obligatoire' })
  @IsString({ message: 'La description doit être une chaîne de caractère' })
  @WordCount(5, 30, {
    message: 'La description doit contenir entre 5 et 30 mots',
  })
  description: string;

  @ApiProperty({
    enum: ActivityType,
    description:
      "Type d'activité (nautical_sport, hiking, cooking_class, cultural_tour, cycling, art_craft, food_and_drink, bird_watching, photography_tour, wellness)",
    example: 'nautical_sport',
  })
  @IsNotEmpty({ message: 'Le champ "type" est obligatoire' })
  @IsEnum(ActivityType, {
    message: `Le type doit être l'une des valeurs suivantes : ${Object.values(ActivityType).join(', ')}`,
  })
  type: ActivityType;

  @ApiProperty({
    description: "Durée de l'activité (nombre de minutes)",
    example: 120,
  })
  @IsNotEmpty({ message: 'Le champ "duration"  est obligatoire' })
  @IsNumber({}, { message: 'Le nombre de minutes doit être un nombre' })
  @Min(0, { message: 'Le nombre de minutes  ne peut pas être négatif' })
  duration: number;

  @ApiProperty({
    description:
      "Fourchette de prix de l'activité - format 'min-max' avec min ≤ max",
    example: '30-50',
  })
  @IsNotEmpty({ message: 'Le champ "priceRange" est obligatoire' })
  @IsString()
  @IsPriceRange({
    message:
      'Le champ priceRange doit être au format "min-max" avec min ≤ max.',
  })
  priceRange: string;

  @ApiProperty({
    description:
      "Addresse de l'événement - validée par api-adresse.data.gouv.fr",
    example: 'Place du village, Patrimonio (20253)',
  })
  @IsNotEmpty({ message: 'le champ "address" est obligatoire' })
  @IsString({ message: "L'adresse doit être une chaîne de caractères" })
  address: string;

  @ApiProperty({
    type: 'array',
    items: { type: 'string' },
    description: "Langue parlée pour l'activité (fr, en, de, pt, it...)",
    example: '["fr", "it"]',
  })
  @IsNotEmpty({ message: 'Le champ "languages" est obligatoire' })
  @IsArray({ message: 'Les langues doivent être comprises dans un tableau' })
  @ArrayNotEmpty({ message: 'Au moins une langue est requise' })
  @IsIn(LANGUAGES, {
    each: true,
    message: ({ value }) => `Langue non supportée : ${value}`,
  })
  languages: Language[];

  @ApiProperty({
    description: "âge minimum pour participer à l'activité (0 = tout public)",
    example: 12,
  })
  @IsNotEmpty({ message: 'le champ "requiredAge" est obligatoire' })
  @IsNumber({}, { message: "L'âge requis doit être un nombre" })
  @Min(0, { message: "L'âge requis ne peut pas être négatif" })
  requiredAge: number;

  @ApiProperty({
    description: 'Jour de début d’ouverture (0 = lundi, 6 = dimanche)',
    example: 1,
  })
  @IsNotEmpty({ message: 'Le champ "from" est obligatoire' })
  @IsNumber({}, { message: 'le jour de la semaine doit être un nombre' })
  @Min(0, {
    message: 'le jour de de la smeinae ne peut pas être intérieur à 0 (lindi)',
  })
  @Max(6, {
    message: 'le jour de la semaine ne peut pas être supérieur à 6 (dimanche)',
  })
  from: number;

  @ApiProperty({
    description:
      'Jour de fin d’ouverture (0 = lundi, 6 = dimanche) Doit être ≥ from',
    example: 6,
  })
  @IsNotEmpty({ message: 'Le champ "to" est obligatoire' })
  @IsNumber({}, { message: "le jour de fin d'ouverture doit être un nombre" })
  @Min(0, {
    message: 'Le jour de la semaine ne peut pas être inférieur à 0 (lundi)',
  })
  @Max(6, {
    message: 'le jour de la semaine ne peut pas être supérieur à 6 (dimanche)',
  })
  @IsToAfterFrom({
    message: '`to` doit être supérieur ou égal à `from`',
  })
  to: number;

  @ApiProperty({
    description: "Heure d'ouverture de l'hébergement (format HH:mm, 24h)",
    example: '07:00',
  })
  @IsNotEmpty({ message: 'Le champ "open" est obligatoire' })
  @Matches(/^[0-2][0-9]:[0-5][0-9]$/, {
    message: 'L’heure d’ouverture (open) doit être au format HH:mm',
  })
  open: string;

  @ApiProperty({
    description:
      "Heure de fermeture de l'hébergement (format HH:mm, 24h). Doit être après l'heure d'ouverture",
    example: '22:00',
  })
  @IsNotEmpty({ message: 'Le champ "close" est obligatoire' })
  @Matches(/^[0-2][0-9]:[0-5][0-9]$/, {
    message: 'L’heure de fermeture (close) doit être au format HH:mm',
  })
  @IsCloseAfterOpen({
    message:
      'L’heure de fermeture (close) doit être après l’heure d’ouverture (open)',
  })
  close: string;
}
