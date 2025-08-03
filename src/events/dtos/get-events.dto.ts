import { IsDate, IsOptional } from 'class-validator';
import { IntersectionType } from '@nestjs/swagger';
import { PaginationQueryDto } from 'src/common/pagination/dtos/pagination-query.dto';

class GetEventsBaseDto {
  @IsDate({ message: 'startDate doit être de type Date' })
  @IsOptional()
  startDate?: Date;

  @IsDate({ message: 'endDate doit être de type Date' })
  @IsOptional()
  endDate?: Date;
}

export class GetEventsDto extends IntersectionType(
  GetEventsBaseDto,
  PaginationQueryDto,
) {}
