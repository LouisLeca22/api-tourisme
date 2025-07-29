import { BadRequestException, Injectable } from '@nestjs/common';
import { GeocodingService } from 'src/geocoding/providers/geocoding.service';
import { OwnersService } from 'src/owners/providers/owners.service';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Activity } from '../activity.entity';
import { CreateActivityDto } from '../dtos/create-activity.dto';
import { validate as isUuid } from 'uuid';
import { PatchActivityDto } from '../dtos/patch-activity.dto';

@Injectable()
export class ActivitiesService {
  constructor(
    @InjectRepository(Activity)
    private activityRepository: Repository<Activity>,
    private readonly geocodingService: GeocodingService,
    private readonly ownersService: OwnersService,
  ) {}

  public async findAll(limit: number, page: number, ownerId?: string) {
    if (ownerId) await this.ownersService.findOne(ownerId);
    const where = ownerId ? { owner: { id: ownerId } } : {};

    const skip = (page - 1) * limit;

    return await this.activityRepository.find({
      where,
      take: limit,
      skip,
    });
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

  public async create(createActivityDto: CreateActivityDto) {
    const owner = await this.ownersService.findOne(createActivityDto.ownerId);

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
    await this.activityRepository.save(newActivity);
    return newActivity;
  }

  public async update(patchActivityDto: PatchActivityDto) {
    const activity = await this.activityRepository.findOneBy({
      id: patchActivityDto.id,
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

    return await this.activityRepository.save(activity);
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
      throw new BadRequestException("Cet hébergement n'existe pas");
    }

    await this.activityRepository.softRemove(activity);
    return { deleted: true, activityId };
  }
}
