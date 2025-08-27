import {
  ArrayNotEmpty,
  IsArray,
  IsDate,
  IsEnum,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { EventType } from 'src/events/enmus/event-type-enum';
import { WordCount } from 'src/common/validators/word-count.validator';
import { IsEndDateAfterStartDate } from 'src/common/validators/is-end-date-after-start-date.validator';
import { Language, LANGUAGES } from 'src/common/constants/languages.constants';
import { IsPriceRange } from 'src/common/validators/price-range.validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEventDto {
  @ApiProperty({
    description: "Nom de l'événement",
    example: 'Nuits de la Guitare',
  })
  @IsNotEmpty({ message: 'Le champ "name" est obligatoire' })
  @IsString({
    message: 'Le nom doit être une chaîne de caractère',
  })
  @MinLength(3, { message: 'Le nom doit contenir au moins 3 caractères' })
  @MaxLength(96, {
    message: 'Le nom doit contenir au maximum 96 caractères',
  })
  name: string;

  @ApiProperty({
    description: "Description de l'événement",
    example:
      'Concerts de guitare dans un cadre intimiste au cœur de Patrimonio.',
  })
  @IsNotEmpty({ message: 'Le champ "description" est obligatoire' })
  @IsString({ message: 'La description doit être une chaîne de caractère' })
  @WordCount(5, 30, {
    message: 'La description doit contenir entre 5 et 30 mots',
  })
  description: string;

  @ApiProperty({
    enum: EventType,
    description:
      "Type de l'événement (concert, festival, theatre, exhibition, workshop, market, sporting_event, film_festival, wine_tasting, community_meeting)",
    example: 'concert',
  })
  @IsNotEmpty({ message: 'Le champ "type" est obligatoire' })
  @IsEnum(EventType, {
    message: `Le type doit être l'une des valeurs suivantes : ${Object.values(EventType).join(', ')}`,
  })
  type: EventType;

  @ApiProperty({
    description:
      "Addresse de l'événement - validée par api-adresse.data.gouv.fr",
    example: 'Place du village, Patrimonio (20253)',
  })
  @IsNotEmpty({ message: 'le champ "address" est obligatoire' })
  @IsString({ message: "L'adresse doit être une chaîne de caractères" })
  address: string;

  @ApiProperty({
    description: "Date de début de l'évenement - ISO8601",
    example: '2025-07-20T21:00:00+02:00',
  })
  @IsDate({ message: 'La date de fin doit être une date valide' })
  @IsNotEmpty({ message: 'La champ "startDate" est obligatoire' })
  startDate: Date;

  @ApiProperty({
    description: "Date de fin de l'événement - Date de fin > Date de début",
    example: '2025-07-20T21:00:30+02:00',
  })
  @IsNotEmpty({ message: 'le champ "endDate" est obligatoire' })
  @IsDate({ message: 'La date de fin doit être une date valide' })
  @IsEndDateAfterStartDate({
    message: 'La date de fin doit être après la date de début',
  })
  endDate: Date;

  @ApiProperty({
    description:
      "Fourchette de prix de l'événement - format 'min-max' avec min ≤ max",
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
    type: 'array',
    items: { type: 'string' },
    description: "Langue parlée pour l'événement (fr, en, de, pt, it...)",
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
    description: "âge minimum pour participer à l'événement (0 = tout public)",
    example: 12,
  })
  @IsNotEmpty({ message: 'le champ "requiredAge" est obligatoire' })
  @IsNumber({}, { message: "L'âge requis doit être un nombre" })
  @Min(0, { message: "L'âge requis ne peut pas être négatif" })
  requiredAge: number;
}
