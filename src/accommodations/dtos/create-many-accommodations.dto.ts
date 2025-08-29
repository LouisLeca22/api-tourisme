import { IsArray, IsNotEmpty, IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { CreateAccommodationDto } from './create-accommodation-dto';

class CreateAccommodationWithOwnerDto extends CreateAccommodationDto {
  @IsNotEmpty()
  @IsUUID()
  ownerId: string;
}

export class CreateManyAccommodationsDto {
  @ApiProperty({
    type: 'array',
    required: true,
    items: {
      type: 'Accommodation',
    },
    example: {
      accommodations: [
        {
          name: 'Villa des Roses',
          description: 'Charmante villa avec jardin et piscine.',
          type: 'guest_house',
          stars: 4,
          address: '45 avenue des Fleurs, Cannes',
          amenities: ['wifi', 'pool', 'parking', 'air_conditioning'],
          priceRange: '120-250',
          from: 1,
          to: 6,
          open: '09:00',
          close: '20:00',
          ownerId: '4758e828-489b-495d-9c02-8d897565a702',
        },
        {
          name: 'Auberge du Mont',
          description: 'Auberge traditionnelle au cœur des montagnes.',
          type: 'auberge',
          stars: 2,
          address: 'Chemin du Lai 74400 Chamonix-Mont-Blanc',
          amenities: ['wifi', 'breakfast', 'parking', 'fireplace'],
          priceRange: '60-120',
          from: 3,
          to: 6,
          open: '08:00',
          close: '17:00',
          ownerId: '4758e828-489b-495d-9c02-8d897565a702',
        },
      ],
    },
  })
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateAccommodationWithOwnerDto)
  accommodations: CreateAccommodationWithOwnerDto[];
}
