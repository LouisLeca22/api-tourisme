import { Module } from '@nestjs/common';
import { AccommodationsController } from './accommodations.controller';
import { AccommodationsService } from './providers/acommodations.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Accommodation } from './accommodation.entity';
import { OwnersModule } from 'src/owners/owners.module';
import { GeocodingModule } from 'src/common/geocoding/geocoding.module';
import { AccommodationsCreateManyProvider } from './providers/accommodations-create-many.provider';
import { PaginationModule } from 'src/common/pagination/pagination.module';

@Module({
  controllers: [AccommodationsController],
  providers: [AccommodationsService, AccommodationsCreateManyProvider],
  imports: [
    TypeOrmModule.forFeature([Accommodation]),
    OwnersModule,
    GeocodingModule,
    PaginationModule,
  ],
})
export class AccommodationsModule {}
