import { PartialType } from '@nestjs/swagger';
import { CreateRestaurantDto } from './create-restaurant.dto';

export class PatchRestaurantDto extends PartialType(CreateRestaurantDto) {}
