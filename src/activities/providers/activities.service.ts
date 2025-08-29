import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { GeocodingService } from 'src/common/geocoding/providers/geocoding.service';
import { OwnersService } from 'src/owners/providers/owners.service';
import { FindOptionsWhere, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Activity } from '../activity.entity';
import { CreateActivityDto } from '../dtos/create-activity.dto';
import { validate as isUuid } from 'uuid';
import { PatchActivityDto } from '../dtos/patch-activity.dto';
import { ActivitiesCreateManyProvider } from './activities-create-many.provider';
import { CreateManyActivitiesDto } from '../dtos/create-many-activities.dto';
import { PaginationQueryDto } from 'src/common/pagination/dtos/pagination-query.dto';
import { Paginated } from 'src/common/pagination/interfaces/paginated.interface';
import { PaginationProvider } from 'src/common/pagination/providers/pagination.provider';
import { Owner } from 'src/owners/owner.entity';
import { ActiveUserData } from 'src/auth/interfaces/active-user-data.interface';

@Injectable()
export class ActivitiesService {
  constructor(
    @InjectRepository(Activity)
    private activityRepository: Repository<Activity>,
    private readonly geocodingService: GeocodingService,
    private readonly ownersService: OwnersService,
    private readonly activitiesCreateManyProvider: ActivitiesCreateManyProvider,
    private readonly paginationProvider: PaginationProvider,
  ) {}

  public async findAll(
    activitiesQuery: PaginationQueryDto,
    ownerId?: string,
  ): Promise<Paginated<Activity>> {
    const where: FindOptionsWhere<Activity> = {};

    if (ownerId) {
      const owner = await this.ownersService.findOne(ownerId);
      where.owner = { id: owner.id };
    }

    return this.paginationProvider.paginateQuey(
      where,
      {
        limit: activitiesQuery.limit,
        page: activitiesQuery.page,
      },
      this.activityRepository,
    );
  }

  public async findOne(activityId: string) {
    if (!isUuid(activityId)) {
      throw new BadRequestException(
        "Format invalide pour l'identifiant (UUID)",
      );
    }
    const activity = await this.activityRepository.findOneBy({
      id: activityId,
    });

    if (!activity) {
      throw new BadRequestException("Cette activité n'existe pas");
    }
    return activity;
  }

  public async create(
    createActivityDto: CreateActivityDto,
    user: ActiveUserData,
  ) {
    let owner: Owner | undefined = undefined;
    try {
      owner = await this.ownersService.findOne(user.sub);
    } catch (error) {
      throw new ConflictException(error);
    }

    const validdAddress = await this.geocodingService.lookupAddress(
      createActivityDto.address,
    );

    const newActivity = this.activityRepository.create({
      ...createActivityDto,
      address: validdAddress.address,
      city: validdAddress.city,
      postCode: validdAddress.postCode,
      latitude: validdAddress.latitude,
      longitude: validdAddress.longitude,
      owner: owner,
    });

    try {
      await this.activityRepository.save(newActivity);
      return newActivity;
    } catch (error) {
      if (error instanceof Error) {
        if ('code' in error && error.code === '23505') {
          throw new ConflictException("Ce nom d'activité est déjà pris");
        }
      }
      throw new ConflictException(error);
    }
  }

  public async createMany(createManyActivitiesDto: CreateManyActivitiesDto) {
    return await this.activitiesCreateManyProvider.createMany(
      createManyActivitiesDto,
    );
  }

  public async update(activityId: string, patchActivityDto: PatchActivityDto) {
    const activity = await this.activityRepository.findOneBy({
      id: activityId,
    });

    if (!activity) {
      throw new BadRequestException("Cette activité n'existe pas");
    }

    activity.name = patchActivityDto.name ?? activity.name;
    activity.description = patchActivityDto.description ?? activity.description;
    activity.type = patchActivityDto.type ?? activity.type;
    activity.duration = patchActivityDto.duration ?? activity.duration;
    activity.requiredAge = patchActivityDto.requiredAge ?? activity.requiredAge;
    activity.languages = patchActivityDto.languages ?? activity.languages;
    activity.priceRange = patchActivityDto.priceRange ?? activity.priceRange;
    activity.from = patchActivityDto.from ?? activity.from;
    activity.to = patchActivityDto.to ?? activity.to;
    activity.open = patchActivityDto.open ?? activity.open;
    activity.close = patchActivityDto.close ?? activity.close;

    if (patchActivityDto.address) {
      const validdAddress = await this.geocodingService.lookupAddress(
        patchActivityDto.address,
      );

      activity.address = validdAddress.address;
      activity.city = validdAddress.city;
      activity.postCode = validdAddress.postCode;
      activity.latitude = validdAddress.latitude;
      activity.longitude = validdAddress.longitude;
    }

    try {
      return await this.activityRepository.save(activity);
    } catch (error) {
      throw new ConflictException(error);
    }
  }

  public async delete(activityId: string) {
    if (!isUuid(activityId)) {
      throw new BadRequestException(
        "Format invalide pour l'identifiant du propriétaire (UUID)",
      );
    }
    const activity = await this.activityRepository.findOneBy({
      id: activityId,
    });

    if (!activity) {
      throw new BadRequestException("Cette activité n'existe pas");
    }

    try {
      await this.activityRepository.softRemove(activity);
      return { deleted: true, activityId };
    } catch (error) {
      throw new ConflictException(error);
    }
  }
}
