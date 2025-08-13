import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Owner } from '../owner.entity';
import { Repository } from 'typeorm';
import { GoogleOwner } from '../interfaces/google-owner.interface';

@Injectable()
export class CreateGoogleOwnerProvider {
  constructor(
    @InjectRepository(Owner)
    private readonly ownerRepository: Repository<Owner>,
  ) {}

  public async createGoogleOwner(googleOwner: GoogleOwner) {
    try {
      const owner = this.ownerRepository.create({
        googleId: googleOwner.googleId,
        email: googleOwner.email,
        name: googleOwner.firstName + ' ' + googleOwner.lastName,
      });

      return await this.ownerRepository.save(owner);
    } catch (error) {
      throw new ConflictException(error, {
        description:
          'Impossible de créer un nouvel utilisateur à partir des informations Google',
      });
    }
  }
}
