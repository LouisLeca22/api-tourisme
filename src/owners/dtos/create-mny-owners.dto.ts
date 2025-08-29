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
    example: {
      owners: [
        {
          name: 'Hôtel Belle Vue',
          phoneNumber: '+33559234567',
          password: 'Hôtelbellevue1234!',
          email: 'reservation@hotelbellevue.fr',
          websiteUrl: 'https://www.hotelbellevue.fr',
        },
        {
          name: 'Musée d’Art Moderne de Lille',
          phoneNumber: '+33320067890',
          password: 'Muséedartmodernedelille!',
          email: 'info@mamlille.fr',
          websiteUrl: 'https://www.mamlille.fr',
        },
        {
          name: 'Festival des Lumières de Lyon',
          phoneNumber: '+33472324588',
          password: 'Festivaldeslumieresdelyon1234!',
          email: 'orga@lumiereslyon.fr',
          websiteUrl: 'https://www.lumiereslyon.fr',
        },
        {
          name: 'Aventure Canoë Ardèche',
          phoneNumber: '+33475392011',
          password: 'Aventurecanoeardeche1234!',
          email: 'contact@canoe-ardeche.fr',
          websiteUrl: 'https://www.canoe-ardeche.fr',
        },
      ],
    },
  })
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOwnerDto)
  owners: CreateOwnerDto[];
}
