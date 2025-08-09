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
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PatchPlaceDto } from './dtos/patch-place.dto';
import { CreatePlaceDto } from './dtos/create-place.dto';
import { PlacesService } from './providers/places.service';
import { CreateManyPlacesDto } from './dtos/create-many-places.dto';
import { PaginationQueryDto } from 'src/common/pagination/dtos/pagination-query.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { AuthType } from 'src/auth/enums/auth-type.enum';
import { ActiveUser } from 'src/auth/decorators/active-user.decorator';
import { ActiveUserData } from 'src/auth/interfaces/active-user-data.interface';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RoleType } from 'src/auth/enums/role-types.enum';

@Controller('places')
@ApiTags('Sites touristiques')
export class PlacesController {
  constructor(private readonly placesService: PlacesService) {}

  @ApiOperation({
    summary:
      "Recupère la liste des sites touristiques enregistrés dans l'application",
  })
  @ApiResponse({
    status: 200,
    description: 'Sites touristiques récupérés avec succès selon la requête.',
  })
  @ApiParam({
    name: 'ownerId',
    required: false,
    description: 'Récupére les sites touristiques associés à un propriétaire',
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
  @Auth(AuthType.None)
  @Get('{/:ownerId}')
  public getPlaces(
    @Query() placesQuery: PaginationQueryDto,
    @Param('ownerId') ownerId?: string,
  ) {
    return this.placesService.findAll(placesQuery, ownerId);
  }

  @ApiOperation({
    summary: 'Recupère un site touristique par son identifiant',
  })
  @ApiResponse({
    status: 200,
    description: 'Site touristique récupérée avec succès selon la requête.',
  })
  @ApiParam({
    name: 'placeId',
    required: true,
    description: 'identifiant du site touristique',
    example: 'c3919b85-e125-46b6-aee2-0d6a795e365e',
  })
  @Auth(AuthType.None)
  @Get('/single/:placeId')
  public getPlace(@Param('placeId') placeId: string) {
    return this.placesService.findOne(placeId);
  }

  @ApiOperation({
    summary: 'Crée un nouveau site touristique',
  })
  @ApiResponse({
    status: 201,
    description: 'Réponse 201 lorsque le site touristique est créé avec succès',
  })
  @ApiBearerAuth('bearerAuth')
  @Post()
  public createPlace(
    @Body() createPlaceDto: CreatePlaceDto,
    @ActiveUser() user: ActiveUserData,
  ) {
    return this.placesService.create(createPlaceDto, user);
  }

  @ApiOperation({
    summary: 'Crée plusieurs sites touristiques',
  })
  @ApiResponse({
    status: 201,
    description:
      'Réponse 201 lorsque les sites touristiques ont été créés avec succès',
  })
  @ApiBearerAuth('bearerAuth')
  @Roles(RoleType.Admin)
  @Post('create-many')
  public createManyPlaces(@Body() createManyPlacesDto: CreateManyPlacesDto) {
    return this.placesService.createMany(createManyPlacesDto);
  }

  @ApiOperation({
    summary: 'Modifie un site touristique',
  })
  @ApiResponse({
    status: 200,
    description:
      'Réponse 200 lorsque le site touristique est modifié avec succès',
  })
  @ApiBearerAuth('bearerAuth')
  @Patch()
  public updatePlace(@Body() patchPlaceDto: PatchPlaceDto) {
    return this.placesService.update(patchPlaceDto);
  }

  @ApiOperation({
    summary: 'Supprime un site touristique',
  })
  @ApiResponse({
    status: 200,
    description:
      'Réponse 200 lorsque le site touristique est supprimé avec succès',
  })
  @ApiParam({
    name: 'placeId',
    required: true,
    description: "identifiant de l'activité",
    example: 'c3919b85-e125-46b6-aee2-0d6a795e365e',
  })
  @ApiBearerAuth('bearerAuth')
  @Delete('/:placeId')
  public deletePlace(@Param('placeId') placeId: string) {
    return this.placesService.delete(placeId);
  }
}
