import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Owner } from '../owner.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class FindOneByGoogleIdProvider {
  constructor(
    @InjectRepository(Owner)
    private readonly ownerRepository: Repository<Owner>,
  ) {}

  public async findOneByGoogleId(googleId: string) {
    return await this.ownerRepository.findOneBy({ googleId });
  }
}
