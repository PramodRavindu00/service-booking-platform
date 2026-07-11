import { Injectable } from '@nestjs/common';
import {
  CreateServiceDto,
  ServiceResponseDto,
  UpdateServiceDto,
} from './dto/service.dto';
import { CurrentUserType } from 'src/common/constants/constants';
import paginateData, { PaginationQueryDto } from 'src/common/utils/paginate';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class ServiceService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateServiceDto, user: CurrentUserType) {
    await this.prisma.service.create({
      data: { ...dto, createdBy: user.id, updatedBy: user.id },
    });
  }

  async update(id: string, dto: UpdateServiceDto, user: CurrentUserType) {
    await this.prisma.service.update({
      where: { id },
      data: { ...dto, updatedBy: user.id },
    });
  }

  async getOneById(id: string) {
    const service = await this.prisma.service.findUnique({ where: { id } });
    return plainToInstance(ServiceResponseDto, service);
  }

  async getAll(query: PaginationQueryDto) {
    const [services, count] = await Promise.all([
      this.prisma.service.findMany({ ...paginateData(query) }),
      this.prisma.service.count(),
    ]);
    return { data: plainToInstance(ServiceResponseDto, services), count };
  }

  async delete(id: string) {
    await this.prisma.service.delete({ where: { id } });
  }
}
