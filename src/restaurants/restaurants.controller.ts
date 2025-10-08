import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
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
import { Auth } from 'src/auth/decorators/auth.decorator';
import { AuthType } from 'src/auth/enums/auth-type.enum';
import { ActiveUser } from 'src/auth/decorators/active-user.decorator';
import { ActiveUserData } from 'src/auth/interfaces/active-user-data.interface';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RoleType } from 'src/auth/enums/role-types.enum';
import { OwnershipGuard } from 'src/auth/guards/ownership/ownership.guard';
import { Restaurant } from './restaurant.entity';

@Controller('restaurants')
@ApiTags('Restaurants')
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) {}
  @ApiOperation({
    summary: "Recupère la liste des restaurants enregistrés dans l'application",
  })
  @ApiResponse({
    status: 200,
    description: 'Restaurants récupérés avec succès selon la requête',
  })
  @ApiParam({
    name: 'ownerId',
    required: false,
    description: 'Récupére les restaurants associés à un propriétaire',
    example: 'b39c9cc9-02c7-487e-ace0-15e86b7fedb9',
  })
  @ApiQuery({
    name: 'limit',
    type: 'number',
    required: false,
    description: "Nombre d'entrées retournées par requête",
    example: 4,
  })
  @ApiQuery({
    name: 'page',
    type: 'number',
    required: false,
    description: 'Position de la page retournée',
    example: 1,
  })
  @Auth(AuthType.None)
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
    description: 'Restaurant récupéré avec succès selon la requête',
  })
  @ApiParam({
    name: 'restaurantId',
    required: true,
    description: 'Identifiant du restaurant',
    example: '1f77b4d5-8c7f-4c10-a1e1-882bd05c237b',
  })
  @Auth(AuthType.None)
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
  @ApiBearerAuth('bearerAuth')
  @Post()
  public createRestaurant(
    @Body() createRestaurantDto: CreateRestaurantDto,
    @ActiveUser() user: ActiveUserData,
  ) {
    return this.restaurantsService.create(createRestaurantDto, user);
  }

  @ApiOperation({
    summary: 'Crée plusieurs restaurants',
    description: 'Cette route est réservée aux administrateurs',
  })
  @ApiResponse({
    status: 201,
    description:
      'Réponse 201 lorsque les restaurants ont été créés avec succès',
  })
  @ApiBearerAuth('bearerAuth')
  @Roles(RoleType.Admin)
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
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Identifiant du restaurant',
    example: '7fb33988-3e1f-4f8a-ad0e-c778d935024c',
  })
  @ApiBearerAuth('bearerAuth')
  @UseGuards(OwnershipGuard(Restaurant, 'owner'))
  @Patch('/:id')
  public updateRestaurant(
    @Param('id') id: string,
    @Body() patchRestaurantDto: PatchRestaurantDto,
  ) {
    return this.restaurantsService.update(id, patchRestaurantDto);
  }

  @ApiOperation({
    summary: 'Supprime un restaurant',
  })
  @ApiResponse({
    status: 200,
    description: 'Réponse 200 lorsque le restaurant est supprimé avec succès',
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Identifiant du restaurant',
    example: 'f5b1ad5e-fd33-492a-b45e-6365e7b426e9',
  })
  @ApiBearerAuth('bearerAuth')
  @UseGuards(OwnershipGuard(Restaurant, 'owner'))
  @Delete('/:id')
  public deleteRestaurant(@Param('id') id: string) {
    return this.restaurantsService.delete(id);
  }
}
