import { CreateOwnerDto } from './create-owner.dto';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class PatchOwnerDto extends PartialType(CreateOwnerDto) {
  @ApiProperty({
    description: 'Identifiant du propriétaire qui doit être modifié',
    example: 'e4cb5dfc-87b1-4b2f-9d11-5f4b3a1aeb3d',
  })
  @IsUUID()
  @IsNotEmpty()
  id: string;
}
