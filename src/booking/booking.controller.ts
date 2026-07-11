import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  BookingListResponseDto,
  BookingResponseDto,
  CreateBookingDto,
  UpdateBookingStatusDto,
} from './dto/booking.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { BookingService } from './booking.service';
import { CurrentUserType } from 'src/common/constants/constants';
import { PaginationQueryDto } from 'src/common/utils/paginate';
import { PublicRoute } from 'src/common/decorators/public-route.decorator';

@ApiTags('Booking')
@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  @PublicRoute()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a booking',
    description: 'Public endpoint — anyone can submit a booking.',
  })
  @ApiResponse({ status: 201, description: 'Booking created successfully' })
  @ApiResponse({ status: 400, description: 'Validation failed or service inactive' })
  @ApiResponse({ status: 404, description: 'Service not found' })
  @ApiResponse({
    status: 409,
    description: 'Conflicting booking exists for the same service and time',
  })
  create(@Body() dto: CreateBookingDto) {
    return this.bookingService.create(dto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'List all bookings' })
  @ApiResponse({
    status: 200,
    description: 'Paginated list of bookings',
    type: BookingListResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getAll(@Query() query: PaginationQueryDto) {
    return this.bookingService.getAll(query);
  }

  @Get(':bookingId')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get a booking by ID' })
  @ApiParam({
    name: 'bookingId',
    description: 'Booking UUID',
    type: String,
    format: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Booking details',
    type: BookingResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  getOneById(@Param('bookingId', new ParseUUIDPipe()) bookingId: string) {
    return this.bookingService.getOneById(bookingId);
  }

  @Post(':bookingId/cancel')
  @PublicRoute()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Cancel a booking',
    description: 'Public endpoint — cancels the booking by ID.',
  })
  @ApiParam({
    name: 'bookingId',
    description: 'Booking UUID',
    type: String,
    format: 'uuid',
  })
  @ApiResponse({ status: 200, description: 'Booking cancelled successfully' })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  cancel(@Param('bookingId', new ParseUUIDPipe()) bookingId: string) {
    return this.bookingService.cancel(bookingId);
  }

  @Post(':bookingId/update-status')
  @PublicRoute()
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Update booking status',
    description: 'Updates booking status to CONFIRMED or COMPLETED.',
  })
  @ApiParam({
    name: 'bookingId',
    description: 'Booking UUID',
    type: String,
    format: 'uuid',
  })
  @ApiResponse({ status: 200, description: 'Booking status updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid status transition' })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  updateStatus(
    @Param('bookingId', new ParseUUIDPipe()) bookingId: string,
    @Body() dto: UpdateBookingStatusDto,
    @CurrentUser() user: CurrentUserType,
  ) {
    return this.bookingService.updateStatus(bookingId, dto.status, user);
  }
}
