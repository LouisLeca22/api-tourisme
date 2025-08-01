import { Module } from '@nestjs/common';
import { PlacesController } from './places.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OwnersModule } from 'src/owners/owners.module';
import { GeocodingModule } from 'src/geocoding/geocoding.module';
import { PlacesService } from './providers/places.service';
import { Place } from './place.entity';
import { PlacesCreateManyProvider } from './providers/places-create-many.provider';

@Module({
  controllers: [PlacesController],
  providers: [PlacesService, PlacesCreateManyProvider],
  imports: [TypeOrmModule.forFeature([Place]), OwnersModule, GeocodingModule],
})
export class PlacesModule {}
