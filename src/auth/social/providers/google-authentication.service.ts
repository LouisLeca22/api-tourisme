import {
  ForbiddenException,
  forwardRef,
  HttpException,
  Inject,
  Injectable,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';
import jwtConfig from 'src/auth/config/jwt.config';
import { GoogleTokenDto } from '../dtos/google-token.dto';
import { OwnersService } from 'src/owners/providers/owners.service';
import { GenerateTokensProvider } from 'src/auth/providers/generate-tokens.provider';

@Injectable()
export class GoogleAuthenticationService implements OnModuleInit {
  private oauthClient: OAuth2Client;

  constructor(
    @Inject(jwtConfig.KEY)
    private readonly jwtConifguration: ConfigType<typeof jwtConfig>,
    @Inject(forwardRef(() => OwnersService))
    private readonly ownerService: OwnersService,
    private readonly generateTokensProvider: GenerateTokensProvider,
  ) {}

  onModuleInit() {
    const clientId = this.jwtConifguration.googleCLientId;
    const clientSecret = this.jwtConifguration.googleClientSecret;

    this.oauthClient = new OAuth2Client(clientId, clientSecret);
  }

  public async authenticate(googleTokenDto: GoogleTokenDto) {
    try {
      const loginTicket = await this.oauthClient.verifyIdToken({
        idToken: googleTokenDto.token,
      });

      const payload = loginTicket.getPayload();
      if (
        !payload ||
        !payload.email ||
        !payload.sub ||
        !payload.given_name ||
        !payload.family_name
      ) {
        throw new ForbiddenException(
          "Impossible de récupérer les données de l'utilsateur à partir de Google",
        );
      }
      const {
        email,
        sub: googleId,
        given_name: firstName,
        family_name: lastName,
      } = payload;
      const owner = await this.ownerService.findOneByGoogleId(googleId);

      if (owner) {
        return this.generateTokensProvider.generateTokens(owner);
      }

      const newOwner = await this.ownerService.createGoogleOwner({
        email,
        googleId,
        firstName,
        lastName,
      });

      return this.generateTokensProvider.generateTokens(newOwner);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new UnauthorizedException(error);
    }
  }
}
