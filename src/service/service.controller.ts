import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ServiceService } from './service.service';
import { CreateServiceDto, UpdateServiceDto } from './dto/service.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { CurrentUserType } from 'src/common/constants/constants';
import { PaginationQueryDto } from 'src/common/utils/paginate';

@Controller('service')
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  @Post()
  create(@Body() dto: CreateServiceDto, @CurrentUser() user: CurrentUserType) {
    return this.serviceService.create(dto,user)
  }

  @Patch(':serviceId')
  update(
    @Param('serviceId', new ParseUUIDPipe()) serviceId: string,
    @Body() dto: UpdateServiceDto,
    @CurrentUser() user: CurrentUserType,
  ) {
    return this.serviceService.update(serviceId,dto,user)

  }

  @Get(':serviceId')
  getOneById(@Param('serviceId', new ParseUUIDPipe()) serviceId: string) {
    return this.serviceService.getOneById(serviceId)

  }

  @Get()
  getAll(@Query() query: PaginationQueryDto) {
    return this.serviceService.getAll(query)

  }

  @Delete(':serviceId')
  delete(@Param('serviceId', new ParseUUIDPipe()) serviceId: string) {
    return this.serviceService.delete(serviceId)

  }
}
