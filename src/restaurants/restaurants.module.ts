import { Module } from '@nestjs/common';
import { RestaurantsController } from './restaurants.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OwnersModule } from 'src/owners/owners.module';
import { GeocodingModule } from 'src/common/geocoding/geocoding.module';
import { RestaurantsService } from './providers/restaurants.service';
import { Restaurant } from './restaurant.entity';
import { RestaurantsCreateManyProvider } from './providers/restaurants-create-many.provider';
import { PaginationModule } from 'src/common/pagination/pagination.module';

@Module({
  controllers: [RestaurantsController],
  providers: [RestaurantsService, RestaurantsCreateManyProvider],
  imports: [
    TypeOrmModule.forFeature([Restaurant]),
    OwnersModule,
    GeocodingModule,
    PaginationModule,
  ],
})
export class RestaurantsModule {}
