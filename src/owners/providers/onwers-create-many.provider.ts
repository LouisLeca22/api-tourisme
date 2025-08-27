import {
  ConflictException,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { Owner } from '../owner.entity';
import { DataSource } from 'typeorm';
import { CreateManyOwnersDto } from '../dtos/create-mny-owners.dto';
import { HashingProvider } from 'src/auth/providers/hashing.provider';

@Injectable()
export class OnwersCreateManyProvider {
  constructor(
    private readonly dataSource: DataSource,

    private readonly hasingProvider: HashingProvider,
  ) {}
  public async createMany(createManyOwnersDto: CreateManyOwnersDto) {
    const newOwners: Owner[] = [];
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
    } catch {
      throw new RequestTimeoutException(
        'Impossible de se connecter à la base de données',
      );
    }
    try {
      for (const owner of createManyOwnersDto.owners) {
        const newOwner = queryRunner.manager.create(Owner, {
          ...owner,
          password: await this.hasingProvider.hashPassword(owner.password),
        });
        const result = await queryRunner.manager.save(newOwner);
        newOwners.push(result);
      }

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new ConflictException("La transaction n'a pas pu être effectuée", {
        description: String(error),
      });
    } finally {
      await queryRunner.release();
    }
    return newOwners;
  }
}
