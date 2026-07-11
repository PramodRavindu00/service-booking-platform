import { IsBoolean, IsInt, IsOptional, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  size?: number;

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