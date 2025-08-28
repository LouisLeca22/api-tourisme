import {
  IsArray,
  IsEnum,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
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
import { RestaurantType } from '../enums/restaurant-type.enum';
import { Cuisine, CUISINES } from 'src/common/constants/cuisines.constants';
import { IsOpenCloseTimePair } from 'src/common/validators/is-open-close-time-pair.validator';

export class CreateRestaurantDto {
  @ApiProperty({
    description: 'Nom du restaurant',
    example: 'Le Bar à Vins de la Plage',
  })
  @IsNotEmpty({ message: 'Le champ "name" est obligatoire' })
  @IsString({ message: 'Le nom doit être une chaîne de caractère' })
  @MinLength(3, { message: 'Le nom doit contenir au moins 3 caractères' })
  @MaxLength(96, {
    message: 'Le nom doit contenir au maximum 96 caractères',
  })
  name: string;

  @ApiProperty({
    description: 'Description du restaurant',
    example: 'Sélection de vins bio, tapas et coucher de soleil.',
  })
  @IsNotEmpty({ message: 'Le champ "description" est obligatoire' })
  @IsString({ message: 'La description doit être une chaîne de caractère' })
  @WordCount(5, 30, {
    message: 'La description doit contenir entre 5 et 30 mots',
  })
  description: string;

  @ApiProperty({
    enum: RestaurantType,
    description:
      'Type du restaurant (bistro, brewery, pizzeria, cafe, food_truck, caterer, snack_bar, canteen, tea_room, wine_bar, creperie, inn, buffet, gastropub)',
    example: 'wine_bar',
  })
  @IsNotEmpty({ message: 'Le champ "type" est obligatoire' })
  @IsEnum(RestaurantType, {
    message: `Le type doit être l'une des valeurs suivantes : ${Object.values(RestaurantType).join(', ')}`,
  })
  type: RestaurantType;

  @ApiProperty({
    description: "Nombre d'étoiles du restaurant",
    example: 3,
  })
  @IsNotEmpty({ message: 'Le champ "stars" est obligatoire' })
  @IsNumber({}, { message: "Le nombre d'étoile doit être un nombre" })
  @Min(0, { message: "Le nombre d'étoile ne peut pas être négatif" })
  @Max(5, { message: "Le nombre d'étoile ne peut pas dépasser 5" })
  stars: number;

  @ApiProperty({
    description:
      'Addresse du restaurant - validée par api-adresse.data.gouv.fr',
    example: '2 Avenue de la Plage 40600 Biscarrosse',
  })
  @IsNotEmpty({ message: 'Le champ "address" est obligatoire' })
  @IsString({ message: "L'adresse doit être une chaîne de caractères" })
  address: string;

  @ApiProperty({
    type: 'array',
    items: { type: 'string' },
    description:
      'Cuisines servies (seafood, organic, vegan, japanese, italian...)',
    example: '["french", "seafood", "bistro"]',
  })
  @IsNotEmpty({ message: 'Le champ "cuisine" est obligatoire' })
  @IsArray({ message: 'Les cuisines doivent être comprises dans un tableau' })
  @IsIn(CUISINES, {
    each: true,
    message: ({ value }) => `Cuisine non supportée :  ${value}`,
  })
  cuisines: Cuisine[];

  @ApiProperty({
    description:
      "Fourchette de prix du restaurant (nuitée) - format 'min-max' avec min ≤ max",
    example: '20-45',
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
    example: 2,
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
    description: "Heure d'ouverture du restaurant (format HH:mm, 24h)",
    example: '11:00',
  })
  @IsNotEmpty({ message: 'Le champ "open" est obligatoire' })
  @Matches(/^[0-2][0-9]:[0-5][0-9]$/, {
    message: 'L’heure d’ouverture (open) doit être au format HH:mm',
  })
  open: string;

  @ApiProperty({
    description:
      "Heure de fermeture du restaurant (format HH:mm, 24h). Doit être après l'heure d'ouverture",
    example: '14:30',
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

  @ApiProperty({
    description: "Heure d'ouverture 2 du restaurant (format HH:mm, 24h)",
    example: '19:00',
  })
  @IsOptional()
  @IsOpenCloseTimePair({
    message:
      "Le champ 'closeTwo' doit être également renseigné, openTwo ≤ closeTwo",
  })
  @Matches(/^[0-2][0-9]:[0-5][0-9]$/, {
    message: 'L’heure d’ouverture (openTwo) doit être au format HH:mm',
  })
  openTwo?: string;

  @ApiProperty({
    description:
      "Heure de fermeture 2 du restaurant (format HH:mm, 24h). Doit être après l'heure d'ouverture",
    example: '22:30',
  })
  @IsOpenCloseTimePair({
    message:
      "Le champ 'openTwo' doit être également renseigné, openTwo ≤ closeTwo",
  })
  @Matches(/^[0-2][0-9]:[0-5][0-9]$/, {
    message: 'L’heure de fermeture (closeTwo) doit être au format HH:mm',
  })
  @IsOptional()
  closeTwo?: string;
}
