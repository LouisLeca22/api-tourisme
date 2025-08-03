import {
  ConflictException,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CreateManyAccommodationsDto } from '../dtos/create-many-accommodations.dto';
import { Accommodation } from '../accommodation.entity';
import { GeocodingService } from 'src/common/geocoding/providers/geocoding.service';
import { OwnersService } from 'src/owners/providers/owners.service';

@Injectable()
export class AccommodationsCreateManyProvider {
  constructor(
    private readonly dataSource: DataSource,
    private readonly geocodingService: GeocodingService,
    private readonly ownersService: OwnersService,
  ) {}
  public async createMany(
    createManyAccommodationsDto: CreateManyAccommodationsDto,
  ) {
    const newAccommodations: Accommodation[] = [];
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
      for (const accommodation of createManyAccommodationsDto.accommodations) {
        const owner = await this.ownersService.findOne(accommodation.ownerId);

        const validAddress = await this.geocodingService.lookupAddress(
          accommodation.address,
        );

        const newAcaccommodation = queryRunner.manager.create(Accommodation, {
          ...accommodation,
          address: validAddress.address,
          city: validAddress.city,
          postCode: validAddress.postCode,
          latitude: validAddress.latitude,
          longitude: validAddress.longitude,
          owner: owner,
        });
        const result = await queryRunner.manager.save(newAcaccommodation);
        newAccommodations.push(result);
      }

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new ConflictException("la transaction n'a pas pu être effectuée", {
        description: String(error),
      });
    } finally {
      await queryRunner.release();
    }
    return newAccommodations;
  }
}
