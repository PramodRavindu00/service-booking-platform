import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import {
  BookingQueryDto,
  BookingResponseDto,
  CreateBookingDto,
} from './dto/booking.dto';
import { CurrentUserType } from 'src/common/constants/constants';
import { plainToInstance } from 'class-transformer';
import paginateData, { PaginationQueryDto } from 'src/common/utils/paginate';
import { BookingStatusEnum, Prisma } from '@prisma/generated';
import { ServiceService } from 'src/service/service.service';

@Injectable()
export class BookingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly serviceService: ServiceService,
  ) {}

  async create(dto: CreateBookingDto) {
    const service = await this.serviceService.getOneById(dto.serviceId);

    if (!service) {
      throw new NotFoundException('Service not found');
    } else if (!service.isActive) {
      throw new BadRequestException('Service is not active');
    }

    const conflictingBooking = await this.prisma.booking.findFirst({
      where: {
        serviceId: dto.serviceId,
        bookingDate: dto.bookingDate,
        bookingTime: dto.bookingTime,
      },
    });

    if (conflictingBooking) {
      throw new ConflictException(
        'Existing booking found for the same service at same time',
      );
    }

    await this.prisma.booking.create({
      data: { ...dto },
    });
  }

  async getAll(query: BookingQueryDto) {
    const { where, paginate } = this.buildFiltersAndPaginateFromQuery(query);
    const [bookings, count] = await Promise.all([
      this.prisma.booking.findMany({
        where,
        ...paginateData(paginate),
        include: {
          service: { select: { title: true } },
        },
      }),
      this.prisma.booking.count(),
    ]);
    return { data: plainToInstance(BookingResponseDto, bookings), count };
  }

  async getOneById(id: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: {
        service: { select: { title: true } },
      },
    });
    return plainToInstance(BookingResponseDto, booking);
  }

  async cancel(id: string) {
    await this.prisma.booking.update({
      where: { id },
      data: { status: BookingStatusEnum.CANCELLED },
    });
  }

  async updateStatus(
    id: string,
    status: BookingStatusEnum,
    user: CurrentUserType,
  ) {
    const booking = await this.prisma.booking.findUnique({ where: { id } });
    if (!booking) {
      throw new NotFoundException('Booking not found');
    } else if (booking.status === BookingStatusEnum.CANCELLED) {
      throw new BadRequestException('Cannot update a cancelled booking');
    } else if (
      status === BookingStatusEnum.COMPLETED &&
      booking.status === BookingStatusEnum.CONFIRMED
    ) {
      throw new BadRequestException(
        'Cannot reverse an already completed booking',
      );
    } else {
      await this.prisma.booking.update({
        where: { id },
        data: { status, updatedBy: user.id },
      });
    }
  }

  private buildFiltersAndPaginateFromQuery(query: BookingQueryDto) {
    const where: Prisma.BookingWhereInput = {
      ...(query.customerName && {
        customerName: {
          contains: query.customerName,
          mode: 'insensitive',
        },
      }),

      ...(query.customerEmail && {
        customerEmail: query.customerEmail,
      }),

      ...(query.customerPhone && {
        customerPhone: query.customerPhone,
      }),

      ...(query.bookingDate && {
        bookingDate: query.bookingDate,
      }),

      ...(query.bookingTime && {
        bookingTime: query.bookingTime,
      }),

      ...(query.status && {
        status: query.status,
      }),

      ...(query.service && {
        service: {
          title: {
            contains: query.service,
            mode: 'insensitive',
          },
        },
      }),
    };

    const paginate: PaginationQueryDto = {
      ...(query.all && {
        all: query.all,
      }),
      ...(query.page && {
        page: query.page,
      }),
      ...(query.size && {
        size: query.size,
      }),
    };

    return { where, paginate };
  }
}
