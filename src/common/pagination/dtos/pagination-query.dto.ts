import { IsOptional, IsPositive, Max } from 'class-validator';

export class PaginationQueryDto {
  @IsOptional()
  @IsPositive({ message: 'la limite doit être un nombre positif' })
  @Max(30, { message: 'Maxiumum 30 entrée par page' })
  limit: number = 10;
  @IsOptional()
  @IsPositive({ message: 'la page doit être un nombre positif' })
  page: number = 1;
}
