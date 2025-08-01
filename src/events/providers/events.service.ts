import { BadRequestException, Injectable } from '@nestjs/common';
import { GeocodingService } from 'src/geocoding/providers/geocoding.service';
import { OwnersService } from 'src/owners/providers/owners.service';
import { Repository } from 'typeorm';
import { Event } from '../event.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateEventDto } from '../dtos/create-event.dto';
import { validate as isUuid } from 'uuid';
import { PatchEventDto } from '../dtos/patch-event.dto';
import { EventsCreateManyProvider } from './events-create-many.provider';
import { CreateManyEventsDto } from '../dtos/create-many-events.dto';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
    private readonly geocodingService: GeocodingService,
    private readonly ownersService: OwnersService,
    private readonly eventsCreateManyProvider: EventsCreateManyProvider,
  ) {}

  public async findAll(limit: number, page: number, ownerId?: string) {
    if (ownerId) await this.ownersService.findOne(ownerId);
    const where = ownerId ? { owner: { id: ownerId } } : {};

    const skip = (page - 1) * limit;

    return await this.eventRepository.find({
      where,
      take: limit,
      skip,
    });
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

  public async create(createEventDto: CreateEventDto) {
    const owner = await this.ownersService.findOne(createEventDto.ownerId);

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
    await this.eventRepository.save(newEvent);
    return newEvent;
  }

  public async createMany(createManyEventsDto: CreateManyEventsDto) {
    return await this.eventsCreateManyProvider.createMany(createManyEventsDto);
  }

  public async update(patchEventDto: PatchEventDto) {
    const event = await this.eventRepository.findOneBy({
      id: patchEventDto.id,
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

    return await this.eventRepository.save(event);
  }

  public async delete(eventId: string) {
    if (!isUuid(eventId)) {
      throw new BadRequestException(
        "Format invalide pour l'identifiant du propriétaire (UUID)",
      );
    }
    const event = await this.eventRepository.findOneBy({
      id: eventId,
    });

    if (!event) {
      throw new BadRequestException("Cet hébergement n'existe pas");
    }

    await this.eventRepository.softRemove(event);
    return { deleted: true, eventId };
  }
}
