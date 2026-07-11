import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateServiceDto {
  @ApiProperty({ example: 'Haircut', description: 'Service title' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 'Standard haircut service',
    description: 'Service description',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    example: 30,
    description: 'Duration in minutes (whole numbers only)',
  })
  @IsInt()
  @IsNotEmpty()
  duration: number;

  @ApiProperty({ example: 25.5, description: 'Service price' })
  @IsNumber()
  @IsNotEmpty()
  price: number;
}

export class UpdateServiceDto extends PartialType(CreateServiceDto) {
  @ApiPropertyOptional({
    example: true,
    description: 'Whether the service is active',
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class ServiceResponseDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  @Expose()
  id: string;

  @ApiProperty({ example: 'Haircut' })
  @Expose()
  title: string;

  @ApiProperty({ example: 'Standard haircut service' })
  @Expose()
  description: string;

  @ApiProperty({ example: 30 })
  @Expose()
  duration: number;

  @ApiProperty({ example: 25.5 })
  @Expose()
  price: number;

  @ApiProperty({ example: true })
  @Expose()
  isActive: boolean;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  @Expose()
  createdBy: string;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  @Expose()
  updatedBy: string;

  @ApiProperty()
  @Expose()
  createdAt: Date;

  @ApiProperty()
  @Expose()
  updatedAt: Date;
}

export class ServiceListResponseDto {
  @ApiProperty({ type: [ServiceResponseDto] })
  data: ServiceResponseDto[];

  @ApiProperty({ example: 10, description: 'Total number of services' })
  count: number;
}
