import {
  ArrayNotEmpty,
  IsArray,
  IsEnum,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsString,
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
import { Language, LANGUAGES } from 'src/common/constants/languages.constants';
import { PlaceType } from '../enums/place-type.enum';

export class CreatePlaceDto {
  @ApiProperty({
    description: 'Nom du site touristique',
    example: "Musée d'Art Moderne de Céret",
  })
  @IsNotEmpty({ message: 'Le champ "name" est obligatoire' })
  @IsString({ message: 'Le nom doit être une chaîne de caractère' })
  @MinLength(3, { message: 'Le nom doit contenir au moins 3 caractères' })
  @MaxLength(96, {
    message: 'Le nom doit contenir au maximum 96 caractères',
  })
  name: string;

  @ApiProperty({
    description: 'Description du site touristiuqe',
    example: 'Un musée emblématique dédié aux artistes du XXe siècle..',
  })
  @IsNotEmpty({ message: 'Le champ "description" est obligatoire' })
  @IsString({ message: 'La description doit être une chaîne de caractère' })
  @WordCount(5, 30, {
    message: 'La description doit contenir entre 5 et 30 mots',
  })
  description: string;

  @ApiProperty({
    enum: PlaceType,
    description:
      'Type du site touristique (museum, garden, beach, park, historic_site, theater, library, monument, zoo, marketplace)',
    example: 'museum',
  })
  @IsNotEmpty({ message: 'Le champ "type" est obligatoire' })
  @IsEnum(PlaceType, {
    message: `Le type doit être l'une des valeurs suivantes : ${Object.values(PlaceType).join(', ')}`,
  })
  type: PlaceType;

  @ApiProperty({
    description:
      "Fourchette de prix du site touristique - format 'min-max' avec min ≤ max",
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
      'Addresse du site touristique - validée par api-adresse.data.gouv.fr',
    example: '8 Bd Maréchal Joffre, Céret (66400)',
  })
  @IsNotEmpty({ message: 'Le champ "address" est obligatoire' })
  @IsString({ message: "L'adresse doit être une chaîne de caractères" })
  address: string;

  @ApiProperty({
    type: 'array',
    items: { type: 'string' },
    description:
      'Langue parlée au sein du site touristique (fr, en, de, pt, it...)',
    example: '["fr", "en", "es"]',
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
    description:
      'Âge minimum pour entrer dans le site touristique (0 = tout public)',
    example: 0,
  })
  @IsNotEmpty({ message: 'Le champ "requiredAge" est obligatoire' })
  @IsNumber({}, { message: "L'âge requis doit être un nombre" })
  @Min(0, { message: "L'âge requis ne peut pas être négatif" })
  requiredAge: number;

  @ApiProperty({
    description: 'Jour de début d’ouverture (0 = lundi, 6 = dimanche)',
    example: 1,
  })
  @IsNotEmpty({ message: 'Le champ "from" est obligatoire' })
  @IsNumber({}, { message: 'Le jour de la semaine doit être un nombre' })
  @Min(0, {
    message: 'Le jour de de la smeinae ne peut pas être intérieur à 0 (lindi)',
  })
  @Max(6, {
    message: 'Le jour de la semaine ne peut pas être supérieur à 6 (dimanche)',
  })
  from: number;

  @ApiProperty({
    description:
      'Jour de fin d’ouverture (0 = lundi, 6 = dimanche) Doit être ≥ from',
    example: 6,
  })
  @IsNotEmpty({ message: 'Le champ "to" est obligatoire' })
  @IsNumber({}, { message: "Le jour de fin d'ouverture doit être un nombre" })
  @Min(0, {
    message: 'Le jour de la semaine ne peut pas être inférieur à 0 (lundi)',
  })
  @Max(6, {
    message: 'Le jour de la semaine ne peut pas être supérieur à 6 (dimanche)',
  })
  @IsToAfterFrom({
    message: '`to` doit être supérieur ou égal à `from`',
  })
  to: number;

  @ApiProperty({
    description: "Heure d'ouverture du site touristique (format HH:mm, 24h)",
    example: '10:00',
  })
  @IsNotEmpty({ message: 'Le champ "open" est obligatoire' })
  @Matches(/^[0-2][0-9]:[0-5][0-9]$/, {
    message: 'L’heure d’ouverture (open) doit être au format HH:mm',
  })
  open: string;

  @ApiProperty({
    description:
      "Heure de fermeture du site touristique (format HH:mm, 24h). Doit être après l'heure d'ouverture",
    example: '18:00',
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
