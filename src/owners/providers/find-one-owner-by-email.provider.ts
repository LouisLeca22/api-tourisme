import {
  Injectable,
  RequestTimeoutException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Owner } from '../owner.entity';

@Injectable()
export class FindOneOwnerByEmailProvider {
  constructor(
    @InjectRepository(Owner)
    private readonly ownerRepository: Repository<Owner>,
  ) {}

  public async findOneByEmail(email: string) {
    let owner: Owner | null = null;
    try {
      owner = await this.ownerRepository.findOneBy({
        email: email,
      });
    } catch (error) {
      throw new RequestTimeoutException(error, {
        description: 'Impossible de récupérer le propriétaire',
      });
    }

    if (!owner) {
      throw new UnauthorizedException("Le propriétaire n'existe pas");
    }

    return owner;
  }
}
