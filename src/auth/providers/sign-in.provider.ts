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
import { JwtService } from '@nestjs/jwt';
import { ConfigType } from '@nestjs/config';
import jwtConfig from '../config/jwt.config';
import { ActiveUserData } from '../interfaces/active-user-data.interface';

@Injectable()
export class SignInProvider {
  constructor(
    @Inject(forwardRef(() => OwnersService))
    private readonly ownerService: OwnersService,
    private readonly hashingProvider: HashingProvider,
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
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

    const payload: ActiveUserData = {
      sub: owner.id,
      email: owner.email,
      role: owner.role,
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      audience: this.jwtConfiguration.audience,
      issuer: this.jwtConfiguration.issuer,
      secret: this.jwtConfiguration.secret,
      expiresIn: this.jwtConfiguration.accessTokenTtl,
    });

    return {
      accessToken,
    };
  }
}
