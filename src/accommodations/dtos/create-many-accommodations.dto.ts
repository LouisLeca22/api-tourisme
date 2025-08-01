import { IsArray, IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { CreateAccommodationDto } from './create-accommodation-dto';

export class CreateManyAccommodationsDto {
  @ApiProperty({
    type: 'array',
    required: true,
    items: {
      type: 'Activity',
    },
  })
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateAccommodationDto)
  accommodations: CreateAccommodationDto[];
}
