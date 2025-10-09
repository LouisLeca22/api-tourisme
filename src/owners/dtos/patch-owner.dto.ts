import { CreateOwnerDto } from './create-owner.dto';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class PatchOwnerDto extends PartialType(CreateOwnerDto) {
  @ApiProperty({
    description: 'Identifiant du propriétaire qui doit être modifié',
    example: 'cb6b22e9-803d-45cf-b8f0-7deddea9f2f3',
  })
  @IsUUID()
  @IsNotEmpty()
  id: string;
}
