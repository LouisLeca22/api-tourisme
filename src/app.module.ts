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
import { PaginationModule } from './common/pagination/pagination.module';
import jwtConfig from './auth/config/jwt.config';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import appConfig from './config/app.config';
import databaseConfig from './config/database.config';
import environmentValidation from './config/environment.validation';
import { AuthenticationGuard } from './auth/guards/authentication/authentication.guard';
import { AccessTokenGuard } from './auth/guards/access-token/access-token.guard';
import { RolesGuard } from './auth/guards/roles/roles.guard';
import { DataResponseInterceptor } from './common/interceptors/data-response/data-response.interceptor';
import { UploadsModule } from './uploads/uploads.module';

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
      load: [appConfig, databaseConfig],
      validationSchema: environmentValidation,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        autoLoadEntities: true,
        synchronize: true,
        url: configService.get('database.url'),
      }),
    }),
    ActivitiesModule,
    PlacesModule,
    RestaurantsModule,
    PaginationModule,
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync(jwtConfig.asProvider()),
    UploadsModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    AccessTokenGuard,
    {
      provide: APP_INTERCEPTOR,
      useClass: DataResponseInterceptor,
    },
  ],
})
export class AppModule {}
