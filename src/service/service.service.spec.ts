import { Test, TestingModule } from '@nestjs/testing';
import { ServiceService } from './service.service';
import { PrismaService } from 'src/common/prisma/prisma.service';
import {
  CreateServiceDto,
  UpdateServiceDto,
} from './dto/service.dto';
import { CurrentUserType } from 'src/common/constants/constants';
import { PaginationQueryDto } from 'src/common/utils/paginate';

jest.mock('src/common/prisma/prisma.service', () => ({
  PrismaService: class PrismaService {},
}));

describe('ServiceService', () => {
  let service: ServiceService;

  // mocks
  const prisma = {
    service: {
      create: jest.fn(),
      update: jest.fn(),
      findUniqueOrThrow: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      delete: jest.fn(),
    },
  };

  // re-usable test data
  const id = '550e8400-e29b-41d4-a716-446655440000';
  const user: CurrentUserType = {
    id: 'user-123',
    email: 'admin@example.com',
  };
  const mockService = {
    id,
    title: 'Haircut',
    description: 'Standard haircut service',
    duration: 30,
    price: 25.5,
    isActive: true,
    createdBy: user.id,
    updatedBy: user.id,
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ServiceService,
        {
          provide: PrismaService,
          useValue: prisma,
        },
      ],
    }).compile();

    service = module.get<ServiceService>(ServiceService);
  });

  describe('Create a service', () => {
    it('Creates service and returns response dto', async () => {
      const createServiceDto: CreateServiceDto = {
        title: 'Haircut',
        description: 'Standard haircut service',
        duration: 30,
        price: 25.5,
      };

      prisma.service.create.mockResolvedValue(mockService);

      const result = await service.create(createServiceDto, user);

      expect(prisma.service.create).toHaveBeenCalledWith({
        data: {
          ...createServiceDto,
          createdBy: user.id,
          updatedBy: user.id,
        },
      });
      expect(result).toEqual(mockService);
    });
  });

  describe('Update a service', () => {
    it('Updates service with updatedBy from current user', async () => {
      const updateServiceDto: UpdateServiceDto = {
        title: 'Premium Haircut',
        price: 40,
        isActive: false,
      };

      prisma.service.update.mockResolvedValue({
        ...mockService,
        ...updateServiceDto,
        updatedBy: user.id,
      });

      await service.update(id, updateServiceDto, user);

      expect(prisma.service.update).toHaveBeenCalledWith({
        where: { id },
        data: {
          ...updateServiceDto,
          updatedBy: user.id,
        },
      });
    });
  });

  describe('Find a service by Id', () => {
    it('Returns service if exists', async () => {
      prisma.service.findUniqueOrThrow.mockResolvedValue(mockService);

      const result = await service.getOneById(id);

      expect(prisma.service.findUniqueOrThrow).toHaveBeenCalledWith({
        where: { id },
      });
      expect(result).toEqual(mockService);
    });

    it('Throws if not found', async () => {
      const error = new Error('Record to find does not exist');
      prisma.service.findUniqueOrThrow.mockRejectedValue(error);

      await expect(service.getOneById(id)).rejects.toThrow(error);
      expect(prisma.service.findUniqueOrThrow).toHaveBeenCalledWith({
        where: { id },
      });
    });
  });

  describe('Get all services', () => {
    it('Returns paginated services and count', async () => {
      const query: PaginationQueryDto = { page: 1, size: 20 };
      const services = [mockService];
      const count = 1;

      prisma.service.findMany.mockResolvedValue(services);
      prisma.service.count.mockResolvedValue(count);

      const result = await service.getAll(query);

      expect(prisma.service.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: 20,
        orderBy: { createdAt: 'desc' },
      });
      expect(prisma.service.count).toHaveBeenCalled();
      expect(result).toEqual({ data: services, count });
    });

    it('Returns all services when all flag is true', async () => {
      const query: PaginationQueryDto = { all: true };
      const services = [mockService];
      const count = 1;

      prisma.service.findMany.mockResolvedValue(services);
      prisma.service.count.mockResolvedValue(count);

      const result = await service.getAll(query);

      expect(prisma.service.findMany).toHaveBeenCalledWith({
        orderBy: { createdAt: 'desc' },
      });
      expect(prisma.service.count).toHaveBeenCalled();
      expect(result).toEqual({ data: services, count });
    });
  });

  it('Deletes the service', async () => {
    prisma.service.delete.mockResolvedValue(mockService);

    await service.delete(id);

    expect(prisma.service.delete).toHaveBeenCalledWith({
      where: { id },
    });
  });
});
