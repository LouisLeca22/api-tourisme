import { Test, TestingModule } from '@nestjs/testing';
import { CreateOwnerProvider } from './create-owner.provider';
import { MailService } from 'src/mail/providers/mail.service';
import { HashingProvider } from 'src/auth/providers/hashing.provider';
import { DataSource, ObjectLiteral, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Owner } from '../owner.entity';
import { BadRequestException } from '@nestjs/common';

type MockRepository<T extends ObjectLiteral = any> = Partial<
  Record<keyof Repository<T>, jest.Mock>
>;

export const createMockRepository = <
  T extends ObjectLiteral = any,
>(): MockRepository<T> => ({
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
});

describe('CreateOwnerProider', () => {
  let provider: CreateOwnerProvider;
  let ownerRepository: MockRepository;
  const owner = {
    name: 'Test',
    email: 'test@mail.com',
    password: 'Test1234',
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateOwnerProvider,
        { provide: DataSource, useValue: {} },
        {
          provide: getRepositoryToken(Owner),
          useValue: createMockRepository(),
        },
        {
          provide: MailService,
          useValue: { sendOwnerWelcome: jest.fn(() => Promise.resolve()) },
        },
        {
          provide: HashingProvider,
          useValue: { hashPassword: jest.fn(() => owner.password) },
        },
      ],
    }).compile();

    provider = module.get<CreateOwnerProvider>(CreateOwnerProvider);
    ownerRepository = module.get(getRepositoryToken(Owner));
  });

  it('Should be defined', () => {
    expect(provider).toBeDefined();
  });

  describe('createOwner', () => {
    describe('When the owner does not exist in db', () => {
      it('should create the new owner', async () => {
        ownerRepository.findOne?.mockResolvedValue(null);
        ownerRepository.create?.mockReturnValue(owner);
        ownerRepository.save?.mockReturnValue(owner);
        await provider.create(owner);
        expect(ownerRepository.findOne).toHaveBeenCalledWith({
          where: { email: owner.email },
        });
        expect(ownerRepository.create).toHaveBeenCalledWith(owner);
        expect(ownerRepository.save).toHaveBeenCalledWith(owner);
      });
    });
    describe('When owner exists already', () => {
      it('should throw BadRequestException', async () => {
        ownerRepository.findOne?.mockResolvedValue(owner.email);
        ownerRepository.create?.mockReturnValue(owner);
        ownerRepository.save?.mockReturnValue(owner);
        try {
          await provider.create(owner);
        } catch (error) {
          expect(error).toBeInstanceOf(BadRequestException);
        }
      });
    });
  });
});
