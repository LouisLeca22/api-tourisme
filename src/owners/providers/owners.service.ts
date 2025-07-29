import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { AuthService } from 'src/auth/providers/auth.service';
import { Repository } from 'typeorm';
import { Owner } from '../owner.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateOwnerDto } from '../dtos/create-owner.dto';
import { validate as isUuid } from 'uuid';
import { PatchOwnerDto } from '../dtos/patch-owner.dto';

@Injectable()
export class OwnersService {
  constructor(
    @InjectRepository(Owner)
    private ownerRepository: Repository<Owner>,

    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}

  public async findAll(limit: number, page: number) {
    const skip = (page - 1) * limit;

    return await this.ownerRepository.find({
      take: limit,
      skip,
    });
  }

  public async findOne(ownerId: string) {
    if (!isUuid(ownerId)) {
      throw new BadRequestException(
        "Format invalide pour l'identifiant du propriétaire (UUID)",
      );
    }
    const owner = await this.ownerRepository.findOneBy({
      id: ownerId,
    });

    if (!owner) {
      throw new BadRequestException("Ce proprétaire n'existe pas");
    }
    return owner;
  }

  public async create(createOwnerDto: CreateOwnerDto) {
    const existingOwner = await this.ownerRepository.findOne({
      where: { email: createOwnerDto.email },
    });

    if (existingOwner) {
      throw new BadRequestException('Cet utilisateur existe déjà');
    }

    let newOwner = this.ownerRepository.create(createOwnerDto);
    newOwner = await this.ownerRepository.save(newOwner);

    return newOwner;
  }

  public async update(patchOwnerDto: PatchOwnerDto) {
    const owner = await this.ownerRepository.findOneBy({
      id: patchOwnerDto.id,
    });

    if (!owner) {
      throw new BadRequestException("Ce propriétaire n'existe pas");
    }

    owner.name = patchOwnerDto.name ?? owner.name;
    owner.password = patchOwnerDto.password ?? owner.password;
    owner.phoneNumber = patchOwnerDto.phoneNumber ?? owner.phoneNumber;
    owner.websiteUrl = patchOwnerDto.websiteUrl ?? owner.websiteUrl;

    if (patchOwnerDto.email) {
      const existingOwner = await this.ownerRepository.findOne({
        where: { email: patchOwnerDto.email },
      });
      console.log(existingOwner);
      if (existingOwner) {
        throw new BadRequestException('Cet utilisateur existe déjà');
      } else {
        owner.email = patchOwnerDto.email;
      }
    }

    return await this.ownerRepository.save(owner);
  }

  public async delete(ownerId: string) {
    if (!isUuid(ownerId)) {
      throw new BadRequestException(
        "Format invalide pour l'identifiant du propriétaire (UUID)",
      );
    }
    const owner = await this.ownerRepository.findOne({
      where: { id: ownerId },
      relations: [
        'accommodations',
        'events',
        'restaurants',
        'places',
        'activities',
      ],
    });

    if (!owner) {
      throw new BadRequestException("Ce proprétaire n'existe pas");
    }

    await this.ownerRepository.softRemove(owner);
    return { deleted: true, ownerId };
  }
}
