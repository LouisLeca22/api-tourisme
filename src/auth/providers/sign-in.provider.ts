import {
  forwardRef,
  Inject,
  Injectable,
  RequestTimeoutException,
  UnauthorizedException,
} from '@nestjs/common';
import { SignInDto } from '../dtos/sign-in.dto';
import { OwnersService } from 'src/owners/providers/owners.service';
import { HashingProvider } from './hashing.provider';
import { GenerateTokensProvider } from './generate-tokens.provider';

@Injectable()
export class SignInProvider {
  constructor(
    @Inject(forwardRef(() => OwnersService))
    private readonly ownerService: OwnersService,
    private readonly hashingProvider: HashingProvider,
    private readonly generateTokensProvider: GenerateTokensProvider,
  ) {}
  public async signIn(signInDto: SignInDto) {
    const owner = await this.ownerService.findOneByEmail(signInDto.email);
    let isEqual: boolean = false;
    try {
      isEqual = await this.hashingProvider.comparePassword(
        signInDto.password,
        owner.password,
      );
    } catch (error) {
      throw new RequestTimeoutException(error, {
        description: 'Impossible de comparer les mots de passe',
      });
    }

    if (!isEqual) {
      throw new UnauthorizedException('Mot de passe incorrect.');
    }

    return await this.generateTokensProvider.generateTokens(owner);
  }
}
