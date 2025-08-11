import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { OwnersService } from 'src/owners/providers/owners.service';
import { SignInDto } from '../dtos/sign-in.dto';
import { SignInProvider } from './sign-in.provider';
import { RefreshTokenDto } from '../dtos/refresh-token.dto';
import { RefreshTokensProvider } from './refresh-tokens.provider';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => OwnersService))
    private readonly ownersService: OwnersService,
    private readonly signInProvider: SignInProvider,
    private readonly refreshTokensProivder: RefreshTokensProvider,
  ) {}
  public async signIn(signInDto: SignInDto) {
    return await this.signInProvider.signIn(signInDto);
  }

  public async refreshTokens(refreshTokenDto: RefreshTokenDto) {
    return await this.refreshTokensProivder.refreshTokens(refreshTokenDto);
  }
}
