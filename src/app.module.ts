import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { OwnersModule } from './owners/owners.module';
import { EventsModule } from './events/events.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AccommodationsModule } from './accommodations/accommodations.module';
import { ActivitiesModule } from './activities/activities.module';
import { PlacesModule } from './places/places.module';
import { RestaurantsModule } from './restaurants/restaurants.module';

const ENV = process.env.NODE_ENV;
@Module({
  imports: [
    OwnersModule,
    EventsModule,
    AuthModule,
    AccommodationsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: !ENV ? '.env' : `.env.${ENV}`,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        autoLoadEntities: true,
        synchronize: true,
        url: configService.get('DATABASE_URL'),
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
