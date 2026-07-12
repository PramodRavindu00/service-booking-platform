import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateUserDto } from './dto/user.dto';
import { passwordHash } from 'src/common/utils/bcrypt';

jest.mock('src/common/prisma/prisma.service', () => ({
  PrismaService: class PrismaService {},
}));

jest.mock('src/common/utils/bcrypt', () => ({
  passwordHash: jest.fn(),
}));

describe('UserService', () => {
  let service: UserService;

  // mocks
  const prisma = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  };

  // re-usable test data
  const id = '550e8400-e29b-41d4-a716-446655440000';
  const email = 'existing@user.com';
  const mockUser = {
    id,
    email,
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
  };
  const omitPassword = { password: true };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: prisma,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  describe('Find a user by Email', () => {
    it('Returns user if exists', async () => {
      prisma.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.getUserByEmail(email);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email },
        omit: omitPassword,
      });
      expect(result).toEqual(mockUser);
    });

    it('Returns null if not found', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      const result = await service.getUserByEmail(email);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email },
        omit: omitPassword,
      });
      expect(result).toBeNull();
    });
  });

  describe('Find a user by Id', () => {
    it('Returns user if exists', async () => {
      prisma.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.getUserById(id);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id },
        omit: omitPassword,
      });
      expect(result).toEqual(mockUser);
    });

    it('Returns null if not found', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      const result = await service.getUserById(id);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id },
        omit: omitPassword,
      });
      expect(result).toBeNull();
    });
  });

  it('Creates user with hashed password', async () => {
    const createUserDto: CreateUserDto = {
      email: 'new@user.com',
      password: 'plain-password',
    };
    const hashedPassword = 'hashed-password';

    (passwordHash as jest.Mock).mockResolvedValue(hashedPassword);
    prisma.user.create.mockResolvedValue({
      id: 'new-id',
      email: createUserDto.email,
      password: hashedPassword,
    });

    await service.create(createUserDto);

    expect(passwordHash).toHaveBeenCalledWith(createUserDto.password);
    expect(prisma.user.create).toHaveBeenCalledWith({
      data: {
        email: createUserDto.email,
        password: hashedPassword,
      },
    });
  });
});
