import {
  BadRequestException,
  ConflictException,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { CreateOwnerDto } from '../dtos/create-owner.dto';
import { Repository } from 'typeorm';
import { Owner } from '../owner.entity';
import { HashingProvider } from 'src/auth/providers/hashing.provider';
import { InjectRepository } from '@nestjs/typeorm';
import { MailService } from 'src/mail/providers/mail.service';

@Injectable()
export class CreateOwnerProvider {
  constructor(
    @InjectRepository(Owner)
    private readonly ownerRepository: Repository<Owner>,
    private readonly hashingProvider: HashingProvider,
    private readonly mailService: MailService,
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
      password: await this.hashingProvider.hashPassword(
        createOwnerDto.password,
      ),
    });

    try {
      newOwner = await this.ownerRepository.save(newOwner);
    } catch (error) {
      throw new ConflictException(error);
    }

    try {
      await this.mailService.sendOwnerWelcome(newOwner);
    } catch (error) {
      throw new RequestTimeoutException(error);
    }
    return newOwner;
  }
}
