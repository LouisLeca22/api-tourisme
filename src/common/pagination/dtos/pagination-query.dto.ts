import { IsOptional, IsPositive, Max } from 'class-validator';

export class PaginationQueryDto {
  @IsOptional()
  @IsPositive({ message: 'La limite doit être un nombre positif' })
  @Max(30, { message: 'Maxiumum 30 entrées par page' })
  limit: number = 10;
  @IsOptional()
  @IsPositive({ message: 'La page doit être un nombre positif' })
  page: number = 1;
}
