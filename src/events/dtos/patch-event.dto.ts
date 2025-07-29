import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { CreateEventDto } from './create-event.dto';

export class PatchEventDto extends PartialType(CreateEventDto) {
  @ApiProperty({
    description: "Identifiant de l'événement qui doit être modifié",
    example: 101,
  })
  @IsUUID()
  @IsNotEmpty()
  id: string;
}
