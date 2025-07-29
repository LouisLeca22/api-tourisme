import { Module } from '@nestjs/common';
import { GeocodingService } from './providers/geocoding.service';

@Module({
  providers: [GeocodingService],
  exports: [GeocodingService],
})
export class GeocodingModule {}
