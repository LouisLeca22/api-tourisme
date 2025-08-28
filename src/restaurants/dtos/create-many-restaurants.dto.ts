import { IsArray, IsNotEmpty, IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { CreateRestaurantDto } from './create-restaurant.dto';

class CreateRestaurantWithOwnerDto extends CreateRestaurantDto {
  @ApiProperty({
    description: 'Identifiant du propriétaire (UUID)',
    example: '15d6adae-4c27-4f4b-9f4a-446e8b772b7f',
  })
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
  })
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateRestaurantWithOwnerDto)
  restaurants: CreateRestaurantWithOwnerDto[];
}
