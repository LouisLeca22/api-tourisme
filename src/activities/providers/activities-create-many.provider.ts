import {
  ConflictException,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CreateManyActivitiesDto } from '../dtos/create-many-activities.dto';
import { Activity } from '../activity.entity';
import { GeocodingService } from 'src/common/geocoding/providers/geocoding.service';
import { OwnersService } from 'src/owners/providers/owners.service';

@Injectable()
export class ActivitiesCreateManyProvider {
  constructor(
    private readonly dataSource: DataSource,
    private readonly geocodingService: GeocodingService,
    private readonly ownersService: OwnersService,
  ) {}
  public async createMany(createManyActivitiesDto: CreateManyActivitiesDto) {
    const newActivities: Activity[] = [];
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
      for (const activity of createManyActivitiesDto.activities) {
        const owner = await this.ownersService.findOne(activity.ownerId);

        const validAddress = await this.geocodingService.lookupAddress(
          activity.address,
        );

        const newActivity = queryRunner.manager.create(Activity, {
          ...activity,
          address: validAddress.address,
          city: validAddress.city,
          postCode: validAddress.postCode,
          latitude: validAddress.latitude,
          longitude: validAddress.longitude,
          owner: owner,
        });
        const result = await queryRunner.manager.save(newActivity);
        newActivities.push(result);
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
    return newActivities;
  }
}
