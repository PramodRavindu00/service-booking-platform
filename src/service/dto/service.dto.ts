import { PartialType } from '@nestjs/swagger';
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
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsInt()
  @IsNotEmpty()
  duration: number; // duration considers in minutes only as whole numbers

  @IsNumber()
  @IsNotEmpty()
  price: number;
}

// update dto holds values optionally
export class UpdateServiceDto extends PartialType(CreateServiceDto) {
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class ServiceResponseDto {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  description: string;

  @Expose()
  duration: number; 

  @Expose()
  price: number;

  @Expose()
  isActive: boolean;

  @Expose()
  createdBy: string;

  @Expose()
  updatedBy: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
