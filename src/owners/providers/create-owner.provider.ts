import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateOwnerDto } from '../dtos/create-owner.dto';
import { Repository } from 'typeorm';
import { Owner } from '../owner.entity';
import { HashingProvider } from 'src/auth/providers/hashing.provider';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CreateOwnerProvider {
  constructor(
    @InjectRepository(Owner)
    private readonly ownerRepository: Repository<Owner>,
    private readonly hashingProvider: HashingProvider,
  ) {}
  public async create(createOwnerDto: CreateOwnerDto) {
    const existingOwner = await this.ownerRepository.findOne({
      where: { email: createOwnerDto.email },
    });

    if (existingOwner) {
      throw new BadRequestException('Cet utilisateur existe déjà');
    }

    let newOwner = this.ownerRepository.create({
      ...createOwnerDto,
      password: await this.hashingProvider.hashPssword(createOwnerDto.password),
    });
    newOwner = await this.ownerRepository.save(newOwner);

    return newOwner;
  }
}
