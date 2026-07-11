import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';
import { CreateBookingDto, UpdateBookingStatusDto } from './dto/booking.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { BookingService } from './booking.service';
import { CurrentUserType } from 'src/common/constants/constants';
import { PaginationQueryDto } from 'src/common/utils/paginate';
import { PublicRoute } from 'src/common/decorators/public-route.decorator';

@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  @PublicRoute() //any body can submit booking so this is a public endpoint
  create(@Body() dto: CreateBookingDto) {
    return this.bookingService.create(dto);
  }

  @Get()
  getAll(@Query() query: PaginationQueryDto) {
    return this.bookingService.getAll(query);
  }

  @Get(':bookingId')
  getOneById(@Param('bookingId', new ParseUUIDPipe()) bookingId: string) {
    return this.bookingService.getOneById(bookingId);
  }

  @Post(':bookingId/cancel')
  @PublicRoute()
  cancel(@Param('bookingId', new ParseUUIDPipe()) bookingId: string) {
    return this.bookingService.cancel(bookingId);
  }

  @Post(':bookingId/update-status')
  @PublicRoute()
  updateStatus(
    @Param('bookingId', new ParseUUIDPipe()) bookingId: string,
    @Body() dto: UpdateBookingStatusDto,
    @CurrentUser() user: CurrentUserType,
  ) {
    return this.bookingService.updateStatus(bookingId, dto.status, user);
  }
}
