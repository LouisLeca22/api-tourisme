import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { CreateAccommodationDto } from './create-accommodation-dto';

export class PatchAccommodationDto extends PartialType(CreateAccommodationDto) {
  @ApiProperty({
    description: "Identifiant de l'activité qui doit être modifiée",
    example: 101,
  })
  @IsUUID()
  @IsNotEmpty()
  id: string;
}
