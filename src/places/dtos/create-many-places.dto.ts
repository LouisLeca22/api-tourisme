import { IsArray, IsNotEmpty, IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { CreatePlaceDto } from './create-place.dto';

class CreatePlaceWithOwnerDto extends CreatePlaceDto {
  @IsNotEmpty()
  @IsUUID()
  ownerId: string;
}

export class CreateManyPlacesDto {
  @ApiProperty({
    type: 'array',
    required: true,
    items: {
      type: 'Place',
    },
    example: {
      places: [
        {
          name: 'Jardin des Plantes de Montpellier',
          description: 'Un jardin botanique historique fondé au XVIe siècle.',
          type: 'garden',
          address: 'Blvd Henri IV, 34000 Montpellier',
          priceRange: '0-0',
          languages: ['fr', 'en'],
          requiredAge: 0,
          from: 1,
          to: 6,
          open: '08:00',
          close: '18:30',
          ownerId: '4758e828-489b-495d-9c02-8d897565a702',
        },
        {
          name: 'Plage de l’Ouille',
          description:
            'Une plage sauvage et discrète entre Collioure et Argelès.',
          type: 'beach',
          address: 'Chemin de la Galère, 66700 Argelès-sur-Mer',
          priceRange: '0-0',
          languages: ['fr', 'en'],
          requiredAge: 0,
          from: 1,
          to: 6,
          open: '07:00',
          close: '21:00',
          ownerId: '4758e828-489b-495d-9c02-8d897565a702',
        },
      ],
    },
  })
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePlaceWithOwnerDto)
  places: CreatePlaceWithOwnerDto[];
}
