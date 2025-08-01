import { Module, forwardRef } from '@nestjs/common';
import { OwnersController } from './owners.controller';
import { OwnersService } from './providers/owners.service';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Owner } from './owner.entity';
import { OnwersCreateManyProvider } from './providers/onwers-create-many.provider';

@Module({
  controllers: [OwnersController],
  providers: [OwnersService, OnwersCreateManyProvider],
  exports: [OwnersService],
  imports: [TypeOrmModule.forFeature([Owner]), forwardRef(() => AuthModule)],
})
export class OwnersModule {}
