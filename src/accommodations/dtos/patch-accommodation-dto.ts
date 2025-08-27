import { PartialType } from '@nestjs/swagger';
import { CreateAccommodationDto } from './create-accommodation-dto';

export class PatchAccommodationDto extends PartialType(
  CreateAccommodationDto,
) {}
