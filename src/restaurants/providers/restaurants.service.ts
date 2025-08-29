import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { GeocodingService } from 'src/common/geocoding/providers/geocoding.service';
import { OwnersService } from 'src/owners/providers/owners.service';
import { FindOptionsWhere, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Restaurant } from '../restaurant.entity';
import { CreateRestaurantDto } from '../dtos/create-restaurant.dto';
import { validate as isUuid } from 'uuid';
import { PatchRestaurantDto } from '../dtos/patch-restaurant.dto';
import { RestaurantsCreateManyProvider } from './restaurants-create-many.provider';
import { CreateManyRestaurantsDto } from '../dtos/create-many-restaurants.dto';
import { PaginationProvider } from 'src/common/pagination/providers/pagination.provider';
import { PaginationQueryDto } from 'src/common/pagination/dtos/pagination-query.dto';
import { Paginated } from 'src/common/pagination/interfaces/paginated.interface';
import { Owner } from 'src/owners/owner.entity';
import { ActiveUserData } from 'src/auth/interfaces/active-user-data.interface';

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectRepository(Restaurant)
    private restaurantRepository: Repository<Restaurant>,
    private readonly geocodingService: GeocodingService,
    private readonly ownersService: OwnersService,
    private readonly restaurantsCreateManyProvider: RestaurantsCreateManyProvider,
    private readonly paginationProvider: PaginationProvider,
  ) {}

  public async findAll(
    restaurantsQuery: PaginationQueryDto,
    ownerId?: string,
  ): Promise<Paginated<Restaurant>> {
    const where: FindOptionsWhere<Restaurant> = {};

    if (ownerId) {
      const owner = await this.ownersService.findOne(ownerId);
      where.owner = { id: owner.id };
    }

    return this.paginationProvider.paginateQuey(
      where,
      {
        limit: restaurantsQuery.limit,
        page: restaurantsQuery.page,
      },
      this.restaurantRepository,
    );
  }

  public async findOne(restaurantId: string) {
    if (!isUuid(restaurantId)) {
      throw new BadRequestException(
        "Format invalide pour l'identifiant (UUID)",
      );
    }
    const restaurant = await this.restaurantRepository.findOneBy({
      id: restaurantId,
    });

    if (!restaurant) {
      throw new BadRequestException("Ce restaurant n'existe pas");
    }
    return restaurant;
  }

  public async create(
    createRestaurantDto: CreateRestaurantDto,
    user: ActiveUserData,
  ) {
    let owner: Owner | undefined = undefined;
    try {
      owner = await this.ownersService.findOne(user.sub);
    } catch (error) {
      throw new ConflictException(error);
    }

    const validdAddress = await this.geocodingService.lookupAddress(
      createRestaurantDto.address,
    );

    const newRestaurant = this.restaurantRepository.create({
      ...createRestaurantDto,
      address: validdAddress.address,
      city: validdAddress.city,
      postCode: validdAddress.postCode,
      latitude: validdAddress.latitude,
      longitude: validdAddress.longitude,
      owner: owner,
    });
    try {
      await this.restaurantRepository.save(newRestaurant);
      return newRestaurant;
    } catch (error) {
      if (error instanceof Error) {
        if ('code' in error && error.code === '23505') {
          throw new ConflictException('Ce nom de restaurant est déjà pris');
        }
      }
      throw new ConflictException(error);
    }
  }

  public async createMany(createManyRestaurantsDto: CreateManyRestaurantsDto) {
    return await this.restaurantsCreateManyProvider.createMany(
      createManyRestaurantsDto,
    );
  }

  public async update(
    restaurantId: string,
    patchRestaurantDto: PatchRestaurantDto,
  ) {
    const restaurant = await this.restaurantRepository.findOneBy({
      id: restaurantId,
    });

    if (!restaurant) {
      throw new BadRequestException("Ce restaurant n'existe pas");
    }

    restaurant.name = patchRestaurantDto.name ?? restaurant.name;
    restaurant.description =
      patchRestaurantDto.description ?? restaurant.description;
    restaurant.type = patchRestaurantDto.type ?? restaurant.type;
    restaurant.stars = patchRestaurantDto.stars ?? restaurant.stars;
    restaurant.cuisines = patchRestaurantDto.cuisines ?? restaurant.cuisines;
    restaurant.priceRange =
      patchRestaurantDto.priceRange ?? restaurant.priceRange;
    restaurant.from = patchRestaurantDto.from ?? restaurant.from;
    restaurant.to = patchRestaurantDto.to ?? restaurant.to;
    restaurant.open = patchRestaurantDto.open ?? restaurant.open;
    restaurant.close = patchRestaurantDto.close ?? restaurant.close;
    restaurant.openTwo = patchRestaurantDto.openTwo ?? restaurant.openTwo;
    restaurant.closeTwo = patchRestaurantDto.closeTwo ?? restaurant.closeTwo;

    if (patchRestaurantDto.address) {
      const validdAddress = await this.geocodingService.lookupAddress(
        patchRestaurantDto.address,
      );

      restaurant.address = validdAddress.address;
      restaurant.city = validdAddress.city;
      restaurant.postCode = validdAddress.postCode;
      restaurant.latitude = validdAddress.latitude;
      restaurant.longitude = validdAddress.longitude;
    }

    try {
      return await this.restaurantRepository.save(restaurant);
    } catch (error) {
      throw new ConflictException(error);
    }
  }

  public async delete(restaurantId: string) {
    const restaurant = await this.restaurantRepository.findOneBy({
      id: restaurantId,
    });

    if (!restaurant) {
      throw new BadRequestException("Ce restaurant n'existe pas");
    }

    try {
      await this.restaurantRepository.softRemove(restaurant);
      return { deleted: true, restaurantId };
    } catch (error) {
      throw new ConflictException(error);
    }
  }
}
