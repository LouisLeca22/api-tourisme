import { PartialType } from '@nestjs/swagger';
import { CreatePlaceDto } from './create-place.dto';

export class PatchPlaceDto extends PartialType(CreatePlaceDto) {}
