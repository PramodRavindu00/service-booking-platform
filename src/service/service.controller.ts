import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
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
import { ServiceService } from './service.service';
import {
  CreateServiceDto,
  ServiceListResponseDto,
  ServiceResponseDto,
  UpdateServiceDto,
} from './dto/service.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { CurrentUserType } from 'src/common/constants/constants';
import { PaginationQueryDto } from 'src/common/utils/paginate';

@ApiTags('Service')
@ApiBearerAuth('access-token')
@Controller('service')
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new service' })
  @ApiResponse({ status: 201, description: 'Service created successfully' })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(@Body() dto: CreateServiceDto, @CurrentUser() user: CurrentUserType) {
    return this.serviceService.create(dto, user);
  }

  @Patch(':serviceId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update an existing service' })
  @ApiParam({
    name: 'serviceId',
    description: 'Service UUID',
    type: String,
    format: 'uuid',
  })
  @ApiResponse({ status: 200, description: 'Service updated successfully' })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Service not found' })
  update(
    @Param('serviceId', new ParseUUIDPipe()) serviceId: string,
    @Body() dto: UpdateServiceDto,
    @CurrentUser() user: CurrentUserType,
  ) {
    return this.serviceService.update(serviceId, dto, user);
  }

  @Delete(':serviceId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a service' })
  @ApiParam({
    name: 'serviceId',
    description: 'Service UUID',
    type: String,
    format: 'uuid',
  })
  @ApiResponse({ status: 200, description: 'Service deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Service not found' })
  delete(@Param('serviceId', new ParseUUIDPipe()) serviceId: string) {
    return this.serviceService.delete(serviceId);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'List all services' })
  @ApiResponse({
    status: 200,
    description: 'Paginated list of services',
    type: ServiceListResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getAll(@Query() query: PaginationQueryDto) {
    return this.serviceService.getAll(query);
  }

  @Get(':serviceId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get a service by ID' })
  @ApiParam({
    name: 'serviceId',
    description: 'Service UUID',
    type: String,
    format: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Service details',
    type: ServiceResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Service not found' })
  getOneById(@Param('serviceId', new ParseUUIDPipe()) serviceId: string) {
    return this.serviceService.getOneById(serviceId);
  }
}
