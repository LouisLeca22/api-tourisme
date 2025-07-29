import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { CreateActivityDto } from './create-activity.dto';

export class PatchActivityDto extends PartialType(CreateActivityDto) {
  @ApiProperty({
    description: "Identifiant de l'activité qui doit être modifiée",
    example: 101,
  })
  @IsUUID()
  @IsNotEmpty()
  id: string;
}
