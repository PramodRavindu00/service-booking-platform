import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { ServiceModule } from 'src/service/service.module';

@Module({
  imports:[ServiceModule],
  providers: [BookingService],
  controllers: [BookingController],
})
export class BookingModule {}
