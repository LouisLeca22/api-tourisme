import { IsArray, IsNotEmpty, IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { CreateActivityDto } from './create-activity.dto';

class CreateActivityWithOwnerDto extends CreateActivityDto {
  @ApiProperty({
    description: 'Identifiant du propriétaire (UUID)',
    example: '10d0b9f0-a690-4df0-9c56-fd09f18c0dc6',
  })
  @IsNotEmpty()
  @IsUUID()
  ownerId: string;
}

export class CreateManyActivitiesDto {
  @ApiProperty({
    type: 'array',
    required: true,
    items: {
      type: 'Activity',
    },
  })
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateActivityWithOwnerDto)
  activities: CreateActivityWithOwnerDto[];
}
