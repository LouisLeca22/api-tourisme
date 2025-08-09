import { IsArray, IsNotEmpty, IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { CreatePlaceDto } from './create-place.dto';

class CreatePlaceWithOwnerDto extends CreatePlaceDto {
  @ApiProperty({
    description: 'identifiant du propriétaire (UUID)',
    example: '11926678-5ef5-4ea7-bda9-759e64ee29e3',
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
