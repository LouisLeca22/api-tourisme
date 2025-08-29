import { IsArray, IsNotEmpty, IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { CreateActivityDto } from './create-activity.dto';

class CreateActivityWithOwnerDto extends CreateActivityDto {
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
    example: {
      activities: [
        {
          name: 'Randonnée guidée en montagne',
          description: 'Explorez les sentiers avec un guide local passionné.',
          type: 'hiking',
          duration: 4,
          priceRange: '30-60',
          address: 'Chemin des Crêtes, Font-Romeu, Pyrénées-Orientales',
          languages: ['fr'],
          requiredAge: 12,
          from: 1,
          to: 5,
          open: '08:00',
          close: '16:00',
          ownerId: '0bffd256-14ca-444c-9957-f5c52471735f',
        },
        {
          name: 'Cours de cuisine catalane',
          description: 'Apprenez à préparer des plats traditionnels catalans.',
          type: 'cooking_class',
          duration: 3,
          priceRange: '40-70',
          address: '45 avenue de la République, 66000 Perpignan',
          languages: ['fr', 'en', 'es'],
          requiredAge: 16,
          from: 3,
          to: 6,
          open: '14:00',
          close: '17:00',
          ownerId: '0bffd256-14ca-444c-9957-f5c52471735f',
        },
        {
          name: 'Visite historique du centre-ville',
          description: 'Découvrez l’histoire locale avec un guide expert.',
          type: 'cultural_tour',
          duration: 1,
          priceRange: '15-25',
          address: 'Place de la Révolution Française, 66190 Collioure',
          languages: ['fr', 'en'],
          requiredAge: 0,
          from: 1,
          to: 6,
          open: '10:00',
          close: '18:00',
          ownerId: '0bffd256-14ca-444c-9957-f5c52471735f',
        },
      ],
    },
  })
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateActivityWithOwnerDto)
  activities: CreateActivityWithOwnerDto[];
}
