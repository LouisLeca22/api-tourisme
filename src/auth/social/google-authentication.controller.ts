import { Body, Controller, Post } from '@nestjs/common';
import { GoogleAuthenticationService } from './providers/google-authentication.service';
import { GoogleTokenDto } from './dtos/google-token.dto';
import { Auth } from '../decorators/auth.decorator';
import { AuthType } from '../enums/auth-type.enum';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Auth(AuthType.None)
@Controller('auth/google-authentication')
export class GoogleAuthenticationController {
  constructor(
    private readonly googleAuthenticationService: GoogleAuthenticationService,
  ) {}

  @ApiOperation({
    summary: 'Authentification avec Google',
    description:
      "Envoie un **Google ID Token** obtenu via Google Sign-In afin de générer un couple d'`access_token` et `refresh_token`.",
  })
  @ApiOperation({
    description:
      'Objet contenant le token Google (ID Token) renvoyé par Google après le login côté client.',
  })
  @ApiResponse({
    status: 201,
    description: 'Authentification réussie',
    schema: {
      example: {
        accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.<truncated>',
        refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.<truncated>',
        expiresIn: 3600,
      },
    },
  })
  @Post()
  public authenticate(@Body() googleTokenDto: GoogleTokenDto) {
    return this.googleAuthenticationService.authenticate(googleTokenDto);
  }
}
