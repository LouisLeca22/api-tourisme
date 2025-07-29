import { Module } from '@nestjs/common';
import { AccommodationsController } from './accommodations.controller';
import { AccommodationsService } from './providers/acommodations.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Accommodation } from './accommodation.entity';
import { OwnersModule } from 'src/owners/owners.module';
import { GeocodingModule } from 'src/geocoding/geocoding.module';

@Module({
  controllers: [AccommodationsController],
  providers: [AccommodationsService],
  imports: [
    TypeOrmModule.forFeature([Accommodation]),
    OwnersModule,
    GeocodingModule,
  ],
})
export class AccommodationsModule {}
