import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsOptional, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationQueryDto {
  @ApiPropertyOptional({
    example: 1,
    minimum: 1,
    description: 'Page number (default: 1)',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({
    example: 20,
    minimum: 1,
    maximum: 100,
    description: 'Page size (default: 20, max: 100)',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  size?: number;

  @ApiPropertyOptional({
    example: false,
    description: 'When true, returns all records without pagination',
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  all?: boolean;
}

const paginateData = (query: PaginationQueryDto) => {
  if (!query) return undefined;
  const { page = 1, size = 20, all = false } = query;

  if (all) return undefined;
  const take = size;
  return {
    skip: (page - 1) * take,
    take,
  };
};
export default paginateData;