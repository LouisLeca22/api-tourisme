import { IsArray, IsNotEmpty, ValidateNested } from 'class-validator';
import { CreateOwnerDto } from './create-owner.dto';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateManyOwnersDto {
  @ApiProperty({
    type: 'array',
    required: true,
    items: {
      type: 'Owner',
    },
  })
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOwnerDto)
  owners: CreateOwnerDto[];
}
