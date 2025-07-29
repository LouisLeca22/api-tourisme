import { Module } from '@nestjs/common';
import { RestaurantsController } from './restaurants.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OwnersModule } from 'src/owners/owners.module';
import { GeocodingModule } from 'src/geocoding/geocoding.module';
import { RestaurantsService } from './providers/restaurants.service';
import { Restaurant } from './restaurant.entity';

@Module({
  controllers: [RestaurantsController],
  providers: [RestaurantsService],
  imports: [
    TypeOrmModule.forFeature([Restaurant]),
    OwnersModule,
    GeocodingModule,
  ],
})
export class RestaurantsModule {}
