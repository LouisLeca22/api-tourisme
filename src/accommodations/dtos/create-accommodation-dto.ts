import {
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
import { AccommodationType } from '../enums/accommodation-type.enum';
import { AMENITIES, Amenity } from 'src/common/constants/amenities.constants';
import { IsToAfterFrom } from 'src/common/validators/is-to-after-from.validator';
import { IsCloseAfterOpen } from 'src/common/validators/is-close-after-open.validator';

export class CreateAccommodationDto {
  @ApiProperty({
    description: "Nom de l'hébergement",
    example: 'Villa des Roses',
  })
  @IsNotEmpty({ message: 'Le champ "name" est obligatoire' })
  @IsString({ message: 'Le nom doit être une chaîne de caractère' })
  @MinLength(3, { message: 'Le nom doit contenir au moins 3 caractères' })
  @MaxLength(96, {
    message: 'Le nom doit contenir au maximum 96 caractères',
  })
  name: string;

  @ApiProperty({
    description: "Description de l'hébergement",
    example: 'Charmante villa avec jardin et piscine.',
  })
  @IsNotEmpty({ message: 'Le champ "description" est obligatoire' })
  @IsString({ message: 'La description doit être une chaîne de caractère' })
  @WordCount(5, 30, {
    message: 'La description doit contenir entre 5 et 30 mots',
  })
  description: string;

  @ApiProperty({
    enum: AccommodationType,
    description:
      "Type de l'hébergement (hotel, auberge, guest_house, residence, vacation_rental, bed_and_breakfast, camping)",
    example: 'vacantion_rental',
  })
  @IsNotEmpty({ message: 'Le champ "type" est obligatoire' })
  @IsEnum(AccommodationType, {
    message: `Le type doit être l'une des valeurs suivantes : ${Object.values(AccommodationType).join(', ')}`,
  })
  type: AccommodationType;

  @ApiProperty({
    description: "Nombre d'étoiles de l'hébergement",
    example: 4,
  })
  @IsNotEmpty({ message: 'Le champ "stars"  est obligatoire' })
  @IsNumber({}, { message: "Le nombre d'étoile doit être un nombre" })
  @Min(0, { message: "Le nombre d'étoile  ne peut pas être négatif" })
  @Max(5, { message: "Le nombre d'étoile ne peut pas dépasser 5" })
  stars: number;

  @ApiProperty({
    description:
      "Addresse de l'hébergement - validée par api-adresse.data.gouv.fr",
    example: '45 avenue des Fleurs, Cannes (06400)',
  })
  @IsNotEmpty({ message: 'Le champ "address" est obligatoire' })
  @IsString({ message: "L'adresse doit être une chaîne de caractères" })
  address: string;

  @ApiProperty({
    type: 'array',
    items: { type: 'string' },
    description:
      "Équipements fournis avec l'hébergement (pool, wifi, sea_view, parking...)",
    example: '["wifi", "pool", "parking", "air_conditioning"]',
  })
  @IsNotEmpty({ message: 'Le champ "amenities" est obligatoire' })
  @IsArray({ message: 'Les équipements doivent être compris dans un tableau' })
  @IsIn(AMENITIES, {
    each: true,
    message: ({ value }) => `Équipement non supporté :  ${value}`,
  })
  amenities: Amenity[];

  @ApiProperty({
    description:
      "Fourchette de prix de l'hébergement (nuitée) - format 'min-max' avec min ≤ max",
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
