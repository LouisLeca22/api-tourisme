import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { OwnersService } from 'src/owners/providers/owners.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => OwnersService))
    private readonly ownersService: OwnersService,
  ) {}
  public async login(email: string, password: string, id: string) {
    await this.ownersService.findOne(id);
    return 'SAMPLE_TOKEN';
  }

  public isAuth() {
    return true;
  }
}
