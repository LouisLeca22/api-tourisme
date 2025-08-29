import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { GeocodingService } from 'src/common/geocoding/providers/geocoding.service';
import { OwnersService } from 'src/owners/providers/owners.service';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Event } from '../event.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateEventDto } from '../dtos/create-event.dto';
import { validate as isUuid } from 'uuid';
import { PatchEventDto } from '../dtos/patch-event.dto';
import { EventsCreateManyProvider } from './events-create-many.provider';
import { CreateManyEventsDto } from '../dtos/create-many-events.dto';
import { GetEventsDto } from '../dtos/get-events.dto';
import { PaginationProvider } from 'src/common/pagination/providers/pagination.provider';
import { Paginated } from 'src/common/pagination/interfaces/paginated.interface';
import { LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { Owner } from 'src/owners/owner.entity';
import { ActiveUserData } from 'src/auth/interfaces/active-user-data.interface';
@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
    private readonly geocodingService: GeocodingService,
    private readonly ownersService: OwnersService,
    private readonly eventsCreateManyProvider: EventsCreateManyProvider,
    private readonly paginationProvider: PaginationProvider,
  ) {}

  public async findAll(
    eventsQuery: GetEventsDto,
    ownerId?: string,
  ): Promise<Paginated<Event>> {
    const where: FindOptionsWhere<Event> = {};

    if (ownerId) {
      const owner = await this.ownersService.findOne(ownerId);
      where.owner = { id: owner.id };
    }

    if (eventsQuery.startDate && eventsQuery.endDate) {
      where.startDate = LessThanOrEqual(new Date(eventsQuery.endDate));
      where.endDate = MoreThanOrEqual(new Date(eventsQuery.startDate));
    } else if (eventsQuery.startDate) {
      where.endDate = LessThanOrEqual(new Date(eventsQuery.startDate));
    } else if (eventsQuery.endDate) {
      where.startDate = MoreThanOrEqual(new Date(eventsQuery.endDate));
    }

    return this.paginationProvider.paginateQuey(
      where,
      {
        limit: eventsQuery.limit,
        page: eventsQuery.page,
      },
      this.eventRepository,
    );
  }

  public async findOne(eventId: string) {
    if (!isUuid(eventId)) {
      throw new BadRequestException(
        "Format invalide pour l'identifiant (UUID)",
      );
    }
    const event = await this.eventRepository.findOneBy({
      id: eventId,
    });

    if (!event) {
      throw new BadRequestException("Cet événement n'existe pas");
    }
    return event;
  }

  public async create(createEventDto: CreateEventDto, user: ActiveUserData) {
    let owner: Owner | undefined = undefined;
    try {
      owner = await this.ownersService.findOne(user.sub);
    } catch (error) {
      throw new ConflictException(error);
    }

    const validdAddress = await this.geocodingService.lookupAddress(
      createEventDto.address,
    );

    const newEvent = this.eventRepository.create({
      ...createEventDto,
      address: validdAddress.address,
      city: validdAddress.city,
      postCode: validdAddress.postCode,
      latitude: validdAddress.latitude,
      longitude: validdAddress.longitude,
      owner: owner,
    });
    try {
      await this.eventRepository.save(newEvent);
      return newEvent;
    } catch (error) {
      if (error instanceof Error) {
        if ('code' in error && error.code === '23505') {
          throw new ConflictException("Ce nom d'événement est déjà pris");
        }
      }
      throw new ConflictException(error);
    }
  }

  public async createMany(createManyEventsDto: CreateManyEventsDto) {
    return await this.eventsCreateManyProvider.createMany(createManyEventsDto);
  }

  public async update(eventId: string, patchEventDto: PatchEventDto) {
    const event = await this.eventRepository.findOneBy({
      id: eventId,
    });

    if (!event) {
      throw new BadRequestException("Cet événement n'existe pas");
    }

    event.name = patchEventDto.name ?? event.name;
    event.description = patchEventDto.description ?? event.description;
    event.type = patchEventDto.type ?? event.type;
    event.requiredAge = patchEventDto.requiredAge ?? event.requiredAge;
    event.languages = patchEventDto.languages ?? event.languages;
    event.priceRange = patchEventDto.priceRange ?? event.priceRange;
    event.startDate = patchEventDto.startDate ?? event.startDate;
    event.endDate = patchEventDto.endDate ?? event.endDate;

    if (patchEventDto.address) {
      const validdAddress = await this.geocodingService.lookupAddress(
        patchEventDto.address,
      );

      event.address = validdAddress.address;
      event.city = validdAddress.city;
      event.postCode = validdAddress.postCode;
      event.latitude = validdAddress.latitude;
      event.longitude = validdAddress.longitude;
    }

    try {
      return await this.eventRepository.save(event);
    } catch (error) {
      throw new ConflictException(error);
    }
  }

  public async delete(eventId: string) {
    const event = await this.eventRepository.findOneBy({
      id: eventId,
    });

    if (!event) {
      throw new BadRequestException("Cet événement n'existe pas");
    }

    try {
      await this.eventRepository.softRemove(event);
      return { deleted: true, eventId };
    } catch (error) {
      throw new ConflictException(error);
    }
  }
}
