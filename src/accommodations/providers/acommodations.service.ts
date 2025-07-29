import { BadRequestException, Injectable } from '@nestjs/common';
import { GeocodingService } from 'src/geocoding/providers/geocoding.service';
import { OwnersService } from 'src/owners/providers/owners.service';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateAccommodationDto } from '../dtos/create-accommodation-dto';
import { Accommodation } from '../accommodation.entity';
import { validate as isUuid } from 'uuid';
import { PatchAccommodationDto } from '../dtos/patch-accommodation-dto';

@Injectable()
export class AccommodationsService {
  constructor(
    @InjectRepository(Accommodation)
    private accommodationRepository: Repository<Accommodation>,
    private readonly geocodingService: GeocodingService,
    private readonly ownersService: OwnersService,
  ) {}

  public async findAll(limit: number, page: number, ownerId?: string) {
    if (ownerId) await this.ownersService.findOne(ownerId);
    const where = ownerId ? { owner: { id: ownerId } } : {};

    const skip = (page - 1) * limit;

    return await this.accommodationRepository.find({
      where,
      take: limit,
      skip,
    });
  }

  public async findOne(accommodationId: string) {
    if (!isUuid(accommodationId)) {
      throw new BadRequestException(
        "Format invalide pour l'identifiant (UUID)",
      );
    }
    const accommodation = await this.accommodationRepository.findOneBy({
      id: accommodationId,
    });

    if (!accommodation) {
      throw new BadRequestException("Cet hébergement n'existe pas");
    }
    return accommodation;
  }

  public async create(createAccommodationDto: CreateAccommodationDto) {
    const owner = await this.ownersService.findOne(
      createAccommodationDto.ownerId,
    );

    const validdAddress = await this.geocodingService.lookupAddress(
      createAccommodationDto.address,
    );

    const newAccommodation = this.accommodationRepository.create({
      ...createAccommodationDto,
      address: validdAddress.address,
      city: validdAddress.city,
      postCode: validdAddress.postCode,
      latitude: validdAddress.latitude,
      longitude: validdAddress.longitude,
      owner: owner,
    });
    await this.accommodationRepository.save(newAccommodation);
    return newAccommodation;
  }

  public async update(patchAccommodationDto: PatchAccommodationDto) {
    const accommodation = await this.accommodationRepository.findOneBy({
      id: patchAccommodationDto.id,
    });

    if (!accommodation) {
      throw new BadRequestException("Cet hébergement n'existe pas");
    }

    accommodation.name = patchAccommodationDto.name ?? accommodation.name;
    accommodation.description =
      patchAccommodationDto.description ?? accommodation.description;
    accommodation.type = patchAccommodationDto.type ?? accommodation.type;
    accommodation.stars = patchAccommodationDto.stars ?? accommodation.stars;
    accommodation.amenities =
      patchAccommodationDto.amenities ?? accommodation.amenities;

    accommodation.priceRange =
      patchAccommodationDto.priceRange ?? accommodation.priceRange;
    accommodation.from = patchAccommodationDto.from ?? accommodation.from;
    accommodation.to = patchAccommodationDto.to ?? accommodation.to;
    accommodation.open = patchAccommodationDto.open ?? accommodation.open;
    accommodation.close = patchAccommodationDto.close ?? accommodation.close;

    if (patchAccommodationDto.address) {
      const validdAddress = await this.geocodingService.lookupAddress(
        patchAccommodationDto.address,
      );

      accommodation.address = validdAddress.address;
      accommodation.city = validdAddress.city;
      accommodation.postCode = validdAddress.postCode;
      accommodation.latitude = validdAddress.latitude;
      accommodation.longitude = validdAddress.longitude;
    }

    return await this.accommodationRepository.save(accommodation);
  }

  public async delete(accommodationId: string) {
    if (!isUuid(accommodationId)) {
      throw new BadRequestException(
        "Format invalide pour l'identifiant du propriétaire (UUID)",
      );
    }
    const accommodation = await this.accommodationRepository.findOneBy({
      id: accommodationId,
    });

    if (!accommodation) {
      throw new BadRequestException("Cet hébergement n'existe pas");
    }

    await this.accommodationRepository.softRemove(accommodation);
    return { deleted: true, accommodationId };
  }
}
