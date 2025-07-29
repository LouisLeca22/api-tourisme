import { BadRequestException, Injectable } from '@nestjs/common';
import { GeocodingService } from 'src/geocoding/providers/geocoding.service';
import { OwnersService } from 'src/owners/providers/owners.service';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Restaurant } from '../restaurant.entity';
import { CreateRestaurantDto } from '../dtos/create-restaurant.dto';
import { validate as isUuid } from 'uuid';
import { PatchRestaurantDto } from '../dtos/patch-restaurant.dto';

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectRepository(Restaurant)
    private restaurantRepository: Repository<Restaurant>,
    private readonly geocodingService: GeocodingService,
    private readonly ownersService: OwnersService,
  ) {}

  public async findAll(limit: number, page: number, ownerId?: string) {
    if (ownerId) await this.ownersService.findOne(ownerId);
    const where = ownerId ? { owner: { id: ownerId } } : {};

    const skip = (page - 1) * limit;

    return await this.restaurantRepository.find({
      where,
      take: limit,
      skip,
    });
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

  public async create(createRestaurantDto: CreateRestaurantDto) {
    const owner = await this.ownersService.findOne(createRestaurantDto.ownerId);

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
    await this.restaurantRepository.save(newRestaurant);
    return newRestaurant;
  }

  public async update(patchRestaurantDto: PatchRestaurantDto) {
    const restaurant = await this.restaurantRepository.findOneBy({
      id: patchRestaurantDto.id,
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

    return await this.restaurantRepository.save(restaurant);
  }

  public async delete(restaurantId: string) {
    if (!isUuid(restaurantId)) {
      throw new BadRequestException(
        "Format invalide pour l'identifiant du propriétaire (UUID)",
      );
    }
    const restaurant = await this.restaurantRepository.findOneBy({
      id: restaurantId,
    });

    if (!restaurant) {
      throw new BadRequestException("Ce restaurant n'existe pas");
    }

    await this.restaurantRepository.softRemove(restaurant);
    return { deleted: true, restaurantId };
  }
}
