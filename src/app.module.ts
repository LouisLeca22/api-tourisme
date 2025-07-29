import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { OwnersModule } from './owners/owners.module';
import { EventsModule } from './events/events.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AccommodationsModule } from './accommodations/accommodations.module';
import { ActivitiesModule } from './activities/activities.module';
import { PlacesModule } from './places/places.module';
import { RestaurantsModule } from './restaurants/restaurants.module';

@Module({
  imports: [
    OwnersModule,
    EventsModule,
    AuthModule,
    AccommodationsModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [],
      inject: [],
      useFactory: () => ({
        type: 'postgres',
        autoLoadEntities: true,
        synchronize: true,
        url: process.env.DATABASE_URL,
      }),
    }),
    ActivitiesModule,
    PlacesModule,
    RestaurantsModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
