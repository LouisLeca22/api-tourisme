import { Test, TestingModule } from '@nestjs/testing';
import { OwnersService } from './owners.service';
import { CreateGoogleOwnerProvider } from './create-google-owner.provider';
import { FindOneByGoogleIdProvider } from './find-one-by-google-id.provider';
import { FindOneOwnerByEmailProvider } from './find-one-owner-by-email.provider';
import { CreateOwnerProvider } from './create-owner.provider';
import { OnwersCreateManyProvider } from './onwers-create-many.provider';
import { DataSource } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Owner } from '../owner.entity';
import { AuthService } from 'src/auth/providers/auth.service';
import { CreateOwnerDto } from '../dtos/create-owner.dto';
import { RoleType } from 'src/auth/enums/role-types.enum';

describe('OwnersService', () => {
  const mockCreateOwnerProvider: Partial<CreateOwnerProvider> = {
    create: (createOwnerDto: CreateOwnerDto) =>
      Promise.resolve({
        id: '039e6f0a-8aa5-44c7-a193-35c04f20e5f7',
        name: createOwnerDto.name,
        email: createOwnerDto.email,
        role: RoleType.User,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: new Date(),
        events: [],
        accommodations: [],
        restaurants: [],
        places: [],
        activities: [],
      }),
  };
  let service: OwnersService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OwnersService,
        { provide: CreateOwnerProvider, useValue: mockCreateOwnerProvider },
        { provide: DataSource, useValue: {} },
        { provide: getRepositoryToken(Owner), useValue: {} },
        { provide: AuthService, useValue: {} },
        { provide: CreateGoogleOwnerProvider, useValue: {} },
        { provide: FindOneByGoogleIdProvider, useValue: {} },
        { provide: FindOneOwnerByEmailProvider, useValue: {} },
        { provide: OnwersCreateManyProvider, useValue: {} },
      ],
    }).compile();

    service = module.get<OwnersService>(OwnersService);
  });

  it('Should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should be defined', () => {
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(service.create).toBeDefined();
    });
    it('should call createOwner on CreateOwnerProvider', async () => {
      const owner = await service.create({
        name: 'Test',
        email: 'test@mail.com',
        password: 'Test1234!',
      });
      expect(owner.name).toEqual('Test');
    });
  });
});
