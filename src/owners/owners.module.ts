import { Module, forwardRef } from '@nestjs/common';
import { OwnersController } from './owners.controller';
import { OwnersService } from './providers/owners.service';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Owner } from './owner.entity';
import { OnwersCreateManyProvider } from './providers/onwers-create-many.provider';
import { CreateOwnerProvider } from './providers/create-owner.provider';
import { FindOneOwnerByEmailProvider } from './providers/find-one-owner-by-email.provider';
import { FindOneByGoogleIdProvider } from './providers/find-one-by-google-id.provider';
import { CreateGoogleOwnerProvider } from './providers/create-google-owner.provider';

@Module({
  controllers: [OwnersController],
  providers: [
    OwnersService,
    OnwersCreateManyProvider,
    CreateOwnerProvider,
    FindOneOwnerByEmailProvider,
    FindOneByGoogleIdProvider,
    CreateGoogleOwnerProvider,
  ],
  exports: [OwnersService],
  imports: [TypeOrmModule.forFeature([Owner]), forwardRef(() => AuthModule)],
})
export class OwnersModule {}
