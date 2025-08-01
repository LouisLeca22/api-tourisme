import { IsArray, IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { CreateRestaurantDto } from './create-restaurant.dto';

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
  @Type(() => CreateRestaurantDto)
  restaurants: CreateRestaurantDto[];
}
