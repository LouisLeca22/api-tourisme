import { IsArray, IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { CreatePlaceDto } from './create-place.dto';

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
  @Type(() => CreatePlaceDto)
  places: CreatePlaceDto[];
}
