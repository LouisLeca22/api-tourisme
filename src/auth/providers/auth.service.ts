import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { OwnersService } from 'src/owners/providers/owners.service';
import { SignInDto } from '../dtos/sign-in.dto';
import { SignInProvider } from './sign-in.provider';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => OwnersService))
    private readonly ownersService: OwnersService,
    private readonly signInProvider: SignInProvider,
  ) {}
  public async signIn(signInDto: SignInDto) {
    return await this.signInProvider.signIn(signInDto);
  }

  public isAuth() {
    return true;
  }
}
