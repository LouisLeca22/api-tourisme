import { Module } from '@nestjs/common';
import { EventsController } from './events.controller';
import { EventsService } from './providers/events.service';
import { OwnersModule } from 'src/owners/owners.module';
import { GeocodingModule } from 'src/geocoding/geocoding.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './event.entity';
import { EventsCreateManyProvider } from './providers/events-create-many.provider';

@Module({
  controllers: [EventsController],
  providers: [EventsService, EventsCreateManyProvider],
  imports: [TypeOrmModule.forFeature([Event]), OwnersModule, GeocodingModule],
})
export class EventsModule {}
