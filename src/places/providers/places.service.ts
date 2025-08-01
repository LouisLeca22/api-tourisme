import { BadRequestException, Injectable } from '@nestjs/common';
import { GeocodingService } from 'src/geocoding/providers/geocoding.service';
import { OwnersService } from 'src/owners/providers/owners.service';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Place } from '../place.entity';
import { CreatePlaceDto } from '../dtos/create-place.dto';
import { validate as isUuid } from 'uuid';
import { PatchPlaceDto } from '../dtos/patch-place.dto';
import { PlacesCreateManyProvider } from './places-create-many.provider';
import { CreateManyPlacesDto } from '../dtos/create-many-places.dto';

@Injectable()
export class PlacesService {
  constructor(
    @InjectRepository(Place)
    private placeRepository: Repository<Place>,
    private readonly geocodingService: GeocodingService,
    private readonly ownersService: OwnersService,
    private readonly placesCreateManyProvider: PlacesCreateManyProvider,
  ) {}

  public async findAll(limit: number, page: number, ownerId?: string) {
    if (ownerId) await this.ownersService.findOne(ownerId);
    const where = ownerId ? { owner: { id: ownerId } } : {};

    const skip = (page - 1) * limit;

    return await this.placeRepository.find({
      where,
      take: limit,
      skip,
    });
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
      throw new BadRequestException("Cet hébergement n'existe pas");
    }
    return place;
  }

  public async create(createPlaceDto: CreatePlaceDto) {
    const owner = await this.ownersService.findOne(createPlaceDto.ownerId);

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
    await this.placeRepository.save(newPlace);
    return newPlace;
  }

  public async createMany(createManyPlacesDto: CreateManyPlacesDto) {
    return await this.placesCreateManyProvider.createMany(createManyPlacesDto);
  }

  public async update(patchPlaceDto: PatchPlaceDto) {
    const place = await this.placeRepository.findOneBy({
      id: patchPlaceDto.id,
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

    return await this.placeRepository.save(place);
  }

  public async delete(placeId: string) {
    if (!isUuid(placeId)) {
      throw new BadRequestException(
        "Format invalide pour l'identifiant du propriétaire (UUID)",
      );
    }
    const place = await this.placeRepository.findOneBy({
      id: placeId,
    });

    if (!place) {
      throw new BadRequestException("Ce site touristique n'existe pas");
    }

    await this.placeRepository.softRemove(place);
    return { deleted: true, placeId };
  }
}
