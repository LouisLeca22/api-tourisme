import { IsArray, IsNotEmpty, IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { CreateAccommodationDto } from './create-accommodation-dto';

class CreateAccommodationWithOwnerDto extends CreateAccommodationDto {
  @ApiProperty({
    description: 'Identifiant du propriétaire (UUID)',
    example: '11926678-5ef5-4ea7-bda9-759e64ee29e3',
  })
  @IsNotEmpty()
  @IsUUID()
  ownerId: string;
}

export class CreateManyAccommodationsDto {
  @ApiProperty({
    type: 'array',
    required: true,
    items: {
      type: 'Accommodation',
    },
  })
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateAccommodationWithOwnerDto)
  accommodations: CreateAccommodationWithOwnerDto[];
}
