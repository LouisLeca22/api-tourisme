import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RestaurantsService } from './providers/restaurants.service';
import { CreateRestaurantDto } from './dtos/create-restaurant.dto';
import { PatchRestaurantDto } from './dtos/patch-restaurant.dto';
import { CreateManyRestaurantsDto } from './dtos/create-many-restaurants.dto';
import { PaginationQueryDto } from 'src/common/pagination/dtos/pagination-query.dto';

@Controller('restaurants')
@ApiTags('Restaurants')
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) {}
  @ApiOperation({
    summary: "Recupère la liste des restaurants enregistrés dans l'application",
  })
  @ApiResponse({
    status: 200,
    description: 'Restaurants récupérés avec succès selon la requête.',
  })
  @ApiParam({
    name: 'ownerId',
    required: false,
    description: 'Récupére les restaurants associés à un propriétaire',
    example: '06f54380-4636-4aed-8953-def85d70f1f5',
  })
  @ApiQuery({
    name: 'limit',
    type: 'number',
    required: false,
    description: "nombre d'entrées retournées par requête",
    example: 10,
  })
  @ApiQuery({
    name: 'page',
    type: 'number',
    required: false,
    description: "position de la page retournée par l'API",
    example: 1,
  })
  @Get('{/:ownerId}')
  public getRestaurants(
    @Query() restaurantsQuery: PaginationQueryDto,
    @Param('ownerId') ownerId?: string,
  ) {
    return this.restaurantsService.findAll(restaurantsQuery, ownerId);
  }

  @ApiOperation({
    summary: 'Recupère un restaurant par son identifiant',
  })
  @ApiResponse({
    status: 200,
    description: 'Restaurant récupéré avec succès selon la requête.',
  })
  @ApiParam({
    name: 'restaurantId',
    required: true,
    description: 'identifiant du restaurant',
    example: 'c3919b85-e125-46b6-aee2-0d6a795e365e',
  })
  @Get('/single/:restaurantId')
  public getRestaurant(@Param('restaurantId') restaurantId: string) {
    return this.restaurantsService.findOne(restaurantId);
  }

  @ApiOperation({
    summary: 'Crée un nouveau restaurant',
  })
  @ApiResponse({
    status: 201,
    description: 'Réponse 201 lorsque le restaurant est créé avec succès',
  })
  @Post()
  public createRestaurant(@Body() createRestaurantDto: CreateRestaurantDto) {
    return this.restaurantsService.create(createRestaurantDto);
  }

  @ApiOperation({
    summary: 'Crée plusieurs restaurants',
  })
  @ApiResponse({
    status: 201,
    description:
      'Réponse 201 lorsque les restaurants ont été créés avec succès',
  })
  @Post('create-many')
  public createManyRestaurants(
    @Body() createManyRestaurantsDto: CreateManyRestaurantsDto,
  ) {
    return this.restaurantsService.createMany(createManyRestaurantsDto);
  }

  @ApiOperation({
    summary: 'Modifie un restaurant',
  })
  @ApiResponse({
    status: 200,
    description: 'Réponse 200 lorsque le restaurant est modifié avec succès',
  })
  @Patch()
  public updateRestaurant(@Body() patchRestaurantDto: PatchRestaurantDto) {
    return this.restaurantsService.update(patchRestaurantDto);
  }

  @ApiOperation({
    summary: 'Supprime un restaurant',
  })
  @ApiResponse({
    status: 200,
    description: 'Réponse 200 lorsque le restaurant est supprimé avec succès',
  })
  @ApiParam({
    name: 'restaurantId',
    required: true,
    description: 'identifiant du restaurant',
    example: 'c3919b85-e125-46b6-aee2-0d6a795e365e',
  })
  @Delete('/:restaurantId')
  public deleteRestaurant(@Param('restaurantId') restaurantId: string) {
    return this.restaurantsService.delete(restaurantId);
  }
}
