import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { GeocodingService } from 'src/common/geocoding/providers/geocoding.service';
import { OwnersService } from 'src/owners/providers/owners.service';
import { FindOptionsWhere, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Place } from '../place.entity';
import { CreatePlaceDto } from '../dtos/create-place.dto';
import { validate as isUuid } from 'uuid';
import { PatchPlaceDto } from '../dtos/patch-place.dto';
import { PlacesCreateManyProvider } from './places-create-many.provider';
import { CreateManyPlacesDto } from '../dtos/create-many-places.dto';
import { PaginationQueryDto } from 'src/common/pagination/dtos/pagination-query.dto';
import { Paginated } from 'src/common/pagination/interfaces/paginated.interface';
import { PaginationProvider } from 'src/common/pagination/providers/pagination.provider';
import { Owner } from 'src/owners/owner.entity';
import { ActiveUserData } from 'src/auth/interfaces/active-user-data.interface';

@Injectable()
export class PlacesService {
  constructor(
    @InjectRepository(Place)
    private placeRepository: Repository<Place>,
    private readonly geocodingService: GeocodingService,
    private readonly ownersService: OwnersService,
    private readonly placesCreateManyProvider: PlacesCreateManyProvider,
    private readonly paginationProvider: PaginationProvider,
  ) {}

  public async findAll(
    placesQuery: PaginationQueryDto,
    ownerId?: string,
  ): Promise<Paginated<Place>> {
    const where: FindOptionsWhere<Place> = {};

    if (ownerId) {
      const owner = await this.ownersService.findOne(ownerId);
      where.owner = { id: owner.id };
    }

    return this.paginationProvider.paginateQuey(
      where,
      {
        limit: placesQuery.limit,
        page: placesQuery.page,
      },
      this.placeRepository,
    );
  }

  public async findOne(placeId: string) {
    if (!isUuid(placeId)) {
      throw new BadRequestException(
        "Format invalide pour l'identifiant (UUID)",
      );
    }
    const place = await this.placeRepository.findOneBy({
      id: placeId,
    });

    if (!place) {
      throw new BadRequestException("Cet site touristique n'existe pas");
    }
    return place;
  }

  public async create(createPlaceDto: CreatePlaceDto, user: ActiveUserData) {
    let owner: Owner | undefined = undefined;
    try {
      owner = await this.ownersService.findOne(user.sub);
    } catch (error) {
      throw new ConflictException(error);
    }
    const validdAddress = await this.geocodingService.lookupAddress(
      createPlaceDto.address,
    );

    const newPlace = this.placeRepository.create({
      ...createPlaceDto,
      address: validdAddress.address,
      city: validdAddress.city,
      postCode: validdAddress.postCode,
      latitude: validdAddress.latitude,
      longitude: validdAddress.longitude,
      owner: owner,
    });

    try {
      await this.placeRepository.save(newPlace);
      return newPlace;
    } catch (error) {
      throw new ConflictException(error);
    }
  }

  public async createMany(createManyPlacesDto: CreateManyPlacesDto) {
    return await this.placesCreateManyProvider.createMany(createManyPlacesDto);
  }

  public async update(placeId: string, patchPlaceDto: PatchPlaceDto) {
    const place = await this.placeRepository.findOneBy({
      id: placeId,
    });

    if (!place) {
      throw new BadRequestException("Ce site touristique n'existe pas");
    }

    place.name = patchPlaceDto.name ?? place.name;
    place.description = patchPlaceDto.description ?? place.description;
    place.type = patchPlaceDto.type ?? place.type;
    place.requiredAge = patchPlaceDto.requiredAge ?? place.requiredAge;
    place.languages = patchPlaceDto.languages ?? place.languages;
    place.priceRange = patchPlaceDto.priceRange ?? place.priceRange;
    place.from = patchPlaceDto.from ?? place.from;
    place.to = patchPlaceDto.to ?? place.to;
    place.open = patchPlaceDto.open ?? place.open;
    place.close = patchPlaceDto.close ?? place.close;

    if (patchPlaceDto.address) {
      const validdAddress = await this.geocodingService.lookupAddress(
        patchPlaceDto.address,
      );

      place.address = validdAddress.address;
      place.city = validdAddress.city;
      place.postCode = validdAddress.postCode;
      place.latitude = validdAddress.latitude;
      place.longitude = validdAddress.longitude;
    }

    try {
      return await this.placeRepository.save(place);
    } catch (error) {
      throw new ConflictException(error);
    }
  }

  public async delete(placeId: string) {
    const place = await this.placeRepository.findOneBy({
      id: placeId,
    });

    if (!place) {
      throw new BadRequestException("Ce site touristique n'existe pas");
    }

    try {
      await this.placeRepository.softRemove(place);
      return { deleted: true, placeId };
    } catch (error) {
      throw new ConflictException(error);
    }
  }
}
