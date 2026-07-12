import { BookingStatusEnum } from '@prisma/generated';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Transform, Type } from 'class-transformer';
import {
  IsDate,
  IsDateString,
  IsEmail,
  IsEnum,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MinDate,
} from 'class-validator';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import utc from 'dayjs/plugin/utc';
import { PaginationQueryDto } from 'src/common/utils/paginate';

dayjs.extend(customParseFormat);
dayjs.extend(utc);

export class CreateBookingDto {
  @ApiProperty({ example: 'John Doe', description: 'Customer full name' })
  @IsString()
  @IsNotEmpty()
  customerName: string;

  @ApiProperty({
    example: 'john@example.com',
    description: 'Customer email address',
  })
  @IsEmail()
  @IsNotEmpty()
  customerEmail: string;

  @ApiProperty({
    example: '+94771234567',
    description: 'Customer phone number',
  })
  @IsString()
  @IsNotEmpty()
  customerPhone: string;

  @ApiProperty({
    example: '2026-07-15',
    description: 'Booking date (cannot be in the past)',
    type: String,
    format: 'date',
  })
  @Transform(({ value }) => {
    if (value instanceof Date) return value;
    const parsed = dayjs.utc(value, 'YYYY-MM-DD', true);
    return parsed.isValid() ? parsed.toDate() : value;
  })
  @IsDate()
  @MinDate(() => dayjs.utc().startOf('day').toDate(), {
    message: 'Booking date cannot be a past date',
  })
  @IsNotEmpty()
  bookingDate: Date;

  @ApiProperty({
    example: '10:30',
    description: 'Booking time (HH:mm)',
  })
  @Transform(({ value }) => {
    if (value instanceof Date) return value;
    const parsed = dayjs.utc(`1970-01-01 ${value}`, 'YYYY-MM-DD HH:mm', true);
    return parsed.isValid() ? parsed.toDate() : value;
  })
  @IsDate({ message: 'bookingTime must be HH:mm' })
  @IsNotEmpty()
  bookingTime: Date;

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'ID of the service to book',
  })
  @IsUUID()
  @IsNotEmpty()
  serviceId: string;

  @ApiPropertyOptional({
    example: 'Please arrive 5 minutes early',
    description: 'Optional notes for the booking',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  notes?: string;
}

export class UpdateBookingStatusDto {
  @ApiProperty({
    enum: [BookingStatusEnum.CONFIRMED, BookingStatusEnum.COMPLETED],
    example: BookingStatusEnum.CONFIRMED,
    description: 'New booking status',
  })
  @IsNotEmpty()
  @IsIn([BookingStatusEnum.CONFIRMED, BookingStatusEnum.COMPLETED])
  status: Extract<BookingStatusEnum, 'CONFIRMED' | 'COMPLETED'>;
}

export class BookingServiceResponseDto {
  @ApiProperty({ example: 'Haircut' })
  @Expose()
  title: string;
}

export class BookingResponseDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  @Expose()
  id: string;

  @ApiProperty({ example: 'John Doe' })
  @Expose()
  customerName: string;

  @ApiProperty({ example: 'john@example.com' })
  @Expose()
  customerEmail: string;

  @ApiProperty({ example: '+94771234567' })
  @Expose()
  customerPhone: string;

  @ApiProperty()
  @Expose()
  bookingDate: Date;

  @ApiProperty()
  @Expose()
  bookingTime: Date;

  @ApiProperty({ enum: BookingStatusEnum })
  @Expose()
  status: BookingStatusEnum;

  @ApiProperty({ type: BookingServiceResponseDto })
  @Expose()
  @Type(() => BookingServiceResponseDto)
  service: BookingServiceResponseDto;

  @ApiPropertyOptional({
    example: 'Please arrive 5 minutes early',
    nullable: true,
  })
  @Expose()
  notes?: string | null;

  @ApiProperty()
  @Expose()
  createdAt: Date;

  @ApiProperty()
  @Expose()
  updatedAt: Date;

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    nullable: true,
  })
  @Expose()
  updatedBy: string;
}

export class BookingQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsString()
  customerName?: string;

  @IsOptional()
  @IsEmail()
  customerEmail?: string;

  @IsOptional()
  @IsString()
  customerPhone?: string;

  @IsOptional()
  @IsDateString()
  bookingDate?: Date;

  @IsOptional()
  @IsDateString()
  bookingTime?: Date;

  @IsOptional()
  @IsEnum(BookingStatusEnum)
  status?: BookingStatusEnum;
  @IsOptional()
  @IsString()
  service?: string;
}

export class BookingListResponseDto {
  @ApiProperty({ type: [BookingResponseDto] })
  data: BookingResponseDto[];

  @ApiProperty({ example: 10, description: 'Total number of bookings' })
  count: number;
}
