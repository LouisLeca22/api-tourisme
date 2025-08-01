import { Module } from '@nestjs/common';
import { ActivitiesController } from './activities.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OwnersModule } from 'src/owners/owners.module';
import { GeocodingModule } from 'src/geocoding/geocoding.module';
import { ActivitiesService } from './providers/activities.service';
import { Activity } from './activity.entity';
import { ActivitiesCreateManyProvider } from './providers/activities-create-many.provider';

@Module({
  controllers: [ActivitiesController],
  providers: [ActivitiesService, ActivitiesCreateManyProvider],
  imports: [
    TypeOrmModule.forFeature([Activity]),
    OwnersModule,
    GeocodingModule,
  ],
})
export class ActivitiesModule {}
