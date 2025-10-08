import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { GeocodingService } from 'src/common/geocoding/providers/geocoding.service';
import { OwnersService } from 'src/owners/providers/owners.service';
import { FindOptionsWhere, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateAccommodationDto } from '../dtos/create-accommodation-dto';
import { Accommodation } from '../accommodation.entity';
import { validate as isUuid } from 'uuid';
import { PatchAccommodationDto } from '../dtos/patch-accommodation-dto';
import { AccommodationsCreateManyProvider } from './accommodations-create-many.provider';
import { CreateManyAccommodationsDto } from '../dtos/create-many-accommodations.dto';
import { PaginationProvider } from 'src/common/pagination/providers/pagination.provider';
import { PaginationQueryDto } from 'src/common/pagination/dtos/pagination-query.dto';
import { Paginated } from 'src/common/pagination/interfaces/paginated.interface';
import { ActiveUserData } from 'src/auth/interfaces/active-user-data.interface';
import { Owner } from 'src/owners/owner.entity';

@Injectable()
export class AccommodationsService {
  constructor(
    @InjectRepository(Accommodation)
    private accommodationRepository: Repository<Accommodation>,
    private readonly geocodingService: GeocodingService,
    private readonly ownersService: OwnersService,
    private readonly accommodationsCreateManyProvider: AccommodationsCreateManyProvider,
    private readonly paginationProvider: PaginationProvider,
  ) {}

  public async findAll(
    accommdationsQuery: PaginationQueryDto,
    ownerId?: string,
  ): Promise<Paginated<Accommodation>> {
    const where: FindOptionsWhere<Accommodation> = {};

    if (ownerId) {
      const owner = await this.ownersService.findOne(ownerId);
      where.owner = { id: owner.id };
    }

    return this.paginationProvider.paginateQuey(
      where,
      {
        limit: accommdationsQuery.limit,
        page: accommdationsQuery.page,
      },
      this.accommodationRepository,
    );
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

  public async create(
    createAccommodationDto: CreateAccommodationDto,
    user: ActiveUserData,
  ) {
    let owner: Owner | undefined = undefined;
    try {
      owner = await this.ownersService.findOne(user.sub);
    } catch (error) {
      if (error instanceof Error) {
        throw new ConflictException(
          error.message || "Une erreur s'est produite",
        );
      }
    }

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

    try {
      await this.accommodationRepository.save(newAccommodation);
      return newAccommodation;
    } catch (error) {
      if (error instanceof Error) {
        if ('code' in error && error.code === '23505') {
          throw new ConflictException("Ce nom d'hébergement est déjà pris");
        }
        throw new ConflictException(
          error.message || "Une erreur s'est produite",
        );
      }
    }
  }

  public async createMany(
    createManyAccommodationsDto: CreateManyAccommodationsDto,
  ) {
    return await this.accommodationsCreateManyProvider.createMany(
      createManyAccommodationsDto,
    );
  }

  public async update(
    accommodationId: string,
    patchAccommodationDto: PatchAccommodationDto,
  ) {
    const accommodation = await this.accommodationRepository.findOneBy({
      id: accommodationId,
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

    try {
      return await this.accommodationRepository.save(accommodation);
    } catch (error) {
      throw new ConflictException(error);
    }
  }

  public async delete(accommodationId: string) {
    const accommodation = await this.accommodationRepository.findOneBy({
      id: accommodationId,
    });

    if (!accommodation) {
      throw new BadRequestException("Cet hébergement n'existe pas");
    }

    try {
      await this.accommodationRepository.softRemove(accommodation);
      return { deleted: true, accommodationId };
    } catch (error) {
      throw new ConflictException(error);
    }
  }
}
