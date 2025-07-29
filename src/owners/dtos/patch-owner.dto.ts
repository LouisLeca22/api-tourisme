import { CreateOwnerDto } from './create-owner.dto';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class PatchOwnerDto extends PartialType(CreateOwnerDto) {
  @ApiProperty({
    description: 'Identifiant du propriétaire qui doit être modifié',
    example: 101,
  })
  @IsUUID()
  @IsNotEmpty()
  id: string;
}
