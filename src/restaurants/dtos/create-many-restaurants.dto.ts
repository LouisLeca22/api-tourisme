import { IsArray, IsNotEmpty, IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { CreateRestaurantDto } from './create-restaurant.dto';

class CreateRestaurantWithOwnerDto extends CreateRestaurantDto {
  @IsNotEmpty()
  @IsUUID()
  ownerId: string;
}
export class CreateManyRestaurantsDto {
  @ApiProperty({
    type: 'array',
    required: true,
    items: {
      type: 'Restaurant',
    },
    example: {
      restaurants: [
        {
          name: 'La Cantine du Port',
          description:
            'Cuisine fraîche et locale dans un cadre portuaire convivial.',
          type: 'canteen',
          address: 'Quai de l’Île, Saint-Martin-de-Ré (17410)',
          priceRange: '18-30',
          stars: 2,
          cuisines: ['seafood', 'local', 'organic'],
          from: 2,
          to: 5,
          open: '12:00',
          close: '15:00',
          ownerId: '4758e828-489b-495d-9c02-8d897565a702',
        },
        {
          name: 'Café des Arts',
          description:
            'Petit café littéraire avec tartines gourmandes et plats végétariens.',
          type: 'cafe',
          address: '18 Rue de la République, Uzès (30700)',
          priceRange: '12-22',
          stars: 3,
          cuisines: ['vegetarian', 'organic', 'french'],
          from: 1,
          to: 5,
          open: '09:00',
          close: '17:00',
          ownerId: '4758e828-489b-495d-9c02-8d897565a702',
        },
        {
          name: 'La Crêperie du Marché',
          description:
            'Crêpes et galettes artisanales dans une ambiance familiale.',
          type: 'creperie',
          address: '5 Place du Marché, Dinan (22100)',
          priceRange: '10-18',
          stars: 4,
          cuisines: ['french', 'local', 'norman'],
          from: 1,
          to: 5,
          open: '11:30',
          close: '15:00',
          ownerId: '4758e828-489b-495d-9c02-8d897565a702',
        },
      ],
    },
  })
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateRestaurantWithOwnerDto)
  restaurants: CreateRestaurantWithOwnerDto[];
}
