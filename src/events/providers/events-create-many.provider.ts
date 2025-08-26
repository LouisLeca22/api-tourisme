import {
  ConflictException,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CreateManyEventsDto } from '../dtos/create-many-events.dto';
import { Event } from '../event.entity';
import { GeocodingService } from 'src/common/geocoding/providers/geocoding.service';
import { OwnersService } from 'src/owners/providers/owners.service';

@Injectable()
export class EventsCreateManyProvider {
  constructor(
    private readonly dataSource: DataSource,
    private readonly geocodingService: GeocodingService,
    private readonly ownersService: OwnersService,
  ) {}
  public async createMany(createManyEventsDto: CreateManyEventsDto) {
    const newEvents: Event[] = [];
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
      for (const event of createManyEventsDto.events) {
        const owner = await this.ownersService.findOne(event.ownerId);

        const validAddress = await this.geocodingService.lookupAddress(
          event.address,
        );

        const newEvent = queryRunner.manager.create(Event, {
          ...event,
          address: validAddress.address,
          city: validAddress.city,
          postCode: validAddress.postCode,
          latitude: validAddress.latitude,
          longitude: validAddress.longitude,
          owner: owner,
        });
        const result = await queryRunner.manager.save(newEvent);
        newEvents.push(result);
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
    return newEvents;
  }
}
