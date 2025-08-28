import { IsArray, IsNotEmpty, IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { CreatePlaceDto } from './create-place.dto';

class CreatePlaceWithOwnerDto extends CreatePlaceDto {
  @ApiProperty({
    description: 'Identifiant du propriétaire (UUID)',
    example: 'b39c9cc9-02c7-487e-ace0-15e86b7fedb9',
  })
  @IsNotEmpty()
  @IsUUID()
  ownerId: string;
}

export class CreateManyPlacesDto {
  @ApiProperty({
    type: 'array',
    required: true,
    items: {
      type: 'Place',
    },
  })
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePlaceWithOwnerDto)
  places: CreatePlaceWithOwnerDto[];
}
