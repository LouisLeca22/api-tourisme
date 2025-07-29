import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { CreateRestaurantDto } from './create-restaurant.dto';

export class PatchRestaurantDto extends PartialType(CreateRestaurantDto) {
  @ApiProperty({
    description: 'Identifiant du restaurant qui doit être modifié',
    example: 101,
  })
  @IsUUID()
  @IsNotEmpty()
  id: string;
}
