import { IsArray, IsNotEmpty, IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { CreateEventDto } from './create-event.dto';

class CreateEventWithOwnerDto extends CreateEventDto {
  @ApiProperty({
    description: 'Identifiant du propriétaire (UUID)',
    example: 'cb6b22e9-803d-45cf-b8f0-7deddea9f2f3',
  })
  @IsNotEmpty()
  @IsUUID()
  ownerId: string;
}

export class CreateManyEventsDto {
  @ApiProperty({
    type: 'array',
    required: true,
    items: {
      type: 'Event',
    },
  })
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateEventWithOwnerDto)
  events: CreateEventWithOwnerDto[];
}
