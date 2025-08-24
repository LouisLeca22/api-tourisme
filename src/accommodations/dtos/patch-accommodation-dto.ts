import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { CreateAccommodationDto } from './create-accommodation-dto';

export class PatchAccommodationDto extends PartialType(CreateAccommodationDto) {
  @ApiProperty({
    description: "Identifiant de l'activité qui doit être modifiée",
    example: '8f87b6f2-73f2-4e9a-a8f6-2f3eacb7b9de',
  })
  @IsUUID()
  @IsNotEmpty()
  id: string;
}
