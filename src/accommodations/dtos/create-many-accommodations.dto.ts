import { IsArray, IsNotEmpty, IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { CreateAccommodationDto } from './create-accommodation-dto';

class CreateAccommodationWithOwnerDto extends CreateAccommodationDto {
  @ApiProperty({
    description: 'Identifiant du propriétaire (UUID)',
    example: '8c5d8e9e-39b0-4fc2-910a-dae63e334fd3',
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
