import { BookingStatusEnum } from '@prisma/generated';
import { Expose, Type } from 'class-transformer';
import {
  IsDate,
  IsDateString,
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MinDate,
} from 'class-validator';

export class CreateBookingDto {
  @IsString()
  @IsNotEmpty()
  customerName: string;

  @IsEmail()
  @IsNotEmpty()
  customerEmail: string;

  @IsString()
  @IsNotEmpty()
  customerPhone: string;

  @Type(() => Date)
  @IsDate()
  @MinDate(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  }, { message: 'Booking date cannot be a past date' })
  @IsNotEmpty()
  bookingDate: Date;

  @IsDateString()
  @IsNotEmpty()
  bookingTime: Date;

  @IsUUID()
  @IsNotEmpty()
  serviceId: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  notes?: string;
}

export class UpdateBookingStatusDto {
  @IsNotEmpty()
  @IsIn([BookingStatusEnum.CONFIRMED, BookingStatusEnum.COMPLETED])
  status: Extract<BookingStatusEnum, 'CONFIRMED' | 'COMPLETED'>;
}

export class BookingServiceResponseDto {
  @Expose()
  title: string;
}

export class BookingResponseDto {
  @Expose()
  id: string;

  @Expose()
  customerName: string;

  @Expose()
  customerEmail: string;

  @Expose()
  customerPhone: string;

  @Expose()
  bookingDate: Date;

  @Expose()
  bookingTime: Date;

  @Expose()
  status: BookingStatusEnum;

  @Expose()
  @Type(() => BookingServiceResponseDto)
  service: BookingServiceResponseDto;

  @Expose()
  notes?: string | null;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  updatedBy: string;
}
