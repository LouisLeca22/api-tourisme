import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { CreatePlaceDto } from './create-place.dto';

export class PatchPlaceDto extends PartialType(CreatePlaceDto) {
  @ApiProperty({
    description: 'Identifiant du site touristique qui doit être modifié',
    example: 101,
  })
  @IsUUID()
  @IsNotEmpty()
  id: string;
}
