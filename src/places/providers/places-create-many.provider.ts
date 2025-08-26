import {
  ConflictException,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CreateManyPlacesDto } from '../dtos/create-many-places.dto';
import { Place } from '../place.entity';
import { GeocodingService } from 'src/common/geocoding/providers/geocoding.service';
import { OwnersService } from 'src/owners/providers/owners.service';

@Injectable()
export class PlacesCreateManyProvider {
  constructor(
    private readonly dataSource: DataSource,
    private readonly geocodingService: GeocodingService,
    private readonly ownersService: OwnersService,
  ) {}
  public async createMany(createManyPlacesDto: CreateManyPlacesDto) {
    const newPlaces: Place[] = [];
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
    } catch {
      throw new RequestTimeoutException(
        'Impossible de se connecter à la base de données',
      );
    }
    try {
      for (const place of createManyPlacesDto.places) {
        const owner = await this.ownersService.findOne(place.ownerId);

        const validAddress = await this.geocodingService.lookupAddress(
          place.address,
        );

        const newPlace = queryRunner.manager.create(Place, {
          ...place,
          address: validAddress.address,
          city: validAddress.city,
          postCode: validAddress.postCode,
          latitude: validAddress.latitude,
          longitude: validAddress.longitude,
          owner: owner,
        });
        const result = await queryRunner.manager.save(newPlace);
        newPlaces.push(result);
      }

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new ConflictException("La transaction n'a pas pu être effectuée", {
        description: String(error),
      });
    } finally {
      await queryRunner.release();
    }
    return newPlaces;
  }
}
