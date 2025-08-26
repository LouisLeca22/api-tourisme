import {
  ConflictException,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CreateManyRestaurantsDto } from '../dtos/create-many-restaurants.dto';
import { Restaurant } from '../restaurant.entity';
import { GeocodingService } from 'src/common/geocoding/providers/geocoding.service';
import { OwnersService } from 'src/owners/providers/owners.service';

@Injectable()
export class RestaurantsCreateManyProvider {
  constructor(
    private readonly dataSource: DataSource,
    private readonly geocodingService: GeocodingService,
    private readonly ownersService: OwnersService,
  ) {}
  public async createMany(createManyRestaurantsDto: CreateManyRestaurantsDto) {
    const newRestaurants: Restaurant[] = [];
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
      for (const restaurant of createManyRestaurantsDto.restaurants) {
        const owner = await this.ownersService.findOne(restaurant.ownerId);

        const validAddress = await this.geocodingService.lookupAddress(
          restaurant.address,
        );

        const newRestaurant = queryRunner.manager.create(Restaurant, {
          ...restaurant,
          address: validAddress.address,
          city: validAddress.city,
          postCode: validAddress.postCode,
          latitude: validAddress.latitude,
          longitude: validAddress.longitude,
          owner: owner,
        });
        const result = await queryRunner.manager.save(newRestaurant);
        newRestaurants.push(result);
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
    return newRestaurants;
  }
}
