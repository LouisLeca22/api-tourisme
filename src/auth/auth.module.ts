import { Module, forwardRef } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './providers/auth.service';
import { OwnersModule } from 'src/owners/owners.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [forwardRef(() => OwnersModule)],
  exports: [AuthService],
})
export class AuthModule {}
