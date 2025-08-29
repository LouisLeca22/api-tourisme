import { IsArray, IsNotEmpty, IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { CreateEventDto } from './create-event.dto';

class CreateEventWithOwnerDto extends CreateEventDto {
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
    example: {
      events: [
        {
          name: 'Festival des Lumières',
          description:
            'Un festival visuel et sonore illuminant les rues du vieux Lyon.',
          type: 'festival',
          address: 'Place des Terreaux, 69001 Lyon',
          startDate: '2025-12-06T18:00:00+01:00',
          endDate: '2025-12-06T23:00:00+01:00',
          priceRange: '0-0',
          languages: ['fr', 'en', 'de'],
          requiredAge: 0,
          ownerId: '4758e828-489b-495d-9c02-8d897565a702',
        },
        {
          name: 'Atelier de peinture contemporaine',
          description:
            'Participez à un atelier créatif avec une artiste renommée.',
          type: 'workshop',
          address: '21 boulevard de Strasbourg, 75010 Paris',
          startDate: '2025-08-03T14:00:00',
          endDate: '2025-08-03T17:00:00',
          priceRange: '35-60',
          languages: ['fr', 'en'],
          requiredAge: 16,
          ownerId: '4758e828-489b-495d-9c02-8d897565a702',
        },
        {
          name: 'Salon des vins bio du Languedoc',
          description:
            'Dégustation de vins naturels avec des producteurs locaux.',
          type: 'wine_tasting',
          address: 'Domaine de l’Hortus, 34270 Valflaunès',
          startDate: '2025-09-15T11:00:00',
          endDate: '2025-09-15T18:00:00',
          priceRange: '10-25',
          languages: ['fr', 'en', 'de', 'nl'],
          requiredAge: 18,
          ownerId: '4758e828-489b-495d-9c02-8d897565a702',
        },
        {
          name: 'Open de pétanque de Marseille',
          description: 'Tournoi international de pétanque sur le Vieux-Port.',
          type: 'sporting_event',
          address: 'Quai de Rive Neuve, 13007 Marseille',
          startDate: '2025-08-10T09:00:00',
          endDate: '2025-08-10T19:00:00',
          priceRange: '5-10',
          languages: ['fr', 'it', 'es'],
          requiredAge: 10,
          ownerId: '4758e828-489b-495d-9c02-8d897565a702',
        },
      ],
    },
  })
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateEventWithOwnerDto)
  events: CreateEventWithOwnerDto[];
}
