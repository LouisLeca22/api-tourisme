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
import { AccommodationsService } from './providers/acommodations.service';
import { CreateAccommodationDto } from './dtos/create-accommodation-dto';
import { PatchAccommodationDto } from './dtos/patch-accommodation-dto';
import { CreateManyAccommodationsDto } from './dtos/create-many-accommodations.dto';
import { PaginationQueryDto } from 'src/common/pagination/dtos/pagination-query.dto';
import { ActiveUser } from 'src/auth/decorators/active-user.decorator';
import { ActiveUserData } from 'src/auth/interfaces/active-user-data.interface';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { AuthType } from 'src/auth/enums/auth-type.enum';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RoleType } from 'src/auth/enums/role-types.enum';
import { OwnershipGuard } from 'src/auth/guards/ownership/ownership.guard';
import { Accommodation } from './accommodation.entity';

@Controller('accommodations')
@ApiTags('Hébergements')
export class AccommodationsController {
  constructor(private readonly accommodationsService: AccommodationsService) {}

  @ApiOperation({
    summary:
      "Recupère la liste des hébergements enregistrés dans l'application",
  })
  @ApiResponse({
    status: 200,
    description: 'Hébergements récupérés avec succès selon la requête',
  })
  @ApiParam({
    name: 'ownerId',
    required: false,
    description: 'Récupére les hébergements associés à un propriétaire',
    example: '10d0b9f0-a690-4df0-9c56-fd09f18c0dc6',
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
  @Get('{/:ownerId}')
  @Auth(AuthType.None)
  public getAccommodations(
    @Query() accommodationsQuery: PaginationQueryDto,
    @Param('ownerId') ownerId?: string,
  ) {
    return this.accommodationsService.findAll(accommodationsQuery, ownerId);
  }

  @ApiOperation({
    summary: 'Recupère un hébergement par son identifiant',
  })
  @ApiResponse({
    status: 200,
    description: 'Hébergement récupéré avec succès selon la requête.',
  })
  @ApiParam({
    name: 'accommodationId',
    required: true,
    description: "Identifiant de l'hébergement",
    example: '2012ea51-a884-4206-b7db-e29335180886',
  })
  @Get('/single/:accommodationId')
  @Auth(AuthType.None)
  public getAccommodation(@Param('accommodationId') accommidationId: string) {
    return this.accommodationsService.findOne(accommidationId);
  }

  @ApiOperation({
    summary: 'Crée un nouvel hébergement',
  })
  @ApiResponse({
    status: 201,
    description: "Réponse 201 lorsque l'hébergement est créé avec succès",
  })
  @Post()
  @ApiBearerAuth('bearerAuth')
  public createAccommodation(
    @Body() createAccommodationDto: CreateAccommodationDto,
    @ActiveUser() user: ActiveUserData,
  ) {
    return this.accommodationsService.create(createAccommodationDto, user);
  }

  @ApiOperation({
    summary: 'Crée plusieurs hébergements',
    description: 'Cette route est réservée aux administrateurs',
  })
  @ApiResponse({
    status: 201,
    description:
      'Réponse 201 lorsque les hébergements ont été créés avec succès',
  })
  @ApiBearerAuth('bearerAuth')
  @Roles(RoleType.Admin)
  @Post('create-many')
  public createManyAccommodations(
    @Body() createManyAccommodationsDto: CreateManyAccommodationsDto,
  ) {
    return this.accommodationsService.createMany(createManyAccommodationsDto);
  }

  @ApiOperation({
    summary: 'Modifie un hébergement',
  })
  @ApiResponse({
    status: 200,
    description: "Réponse 200 lorsque l'hébergement est modifié avec succès",
  })
  @ApiBearerAuth('bearerAuth')
  @ApiParam({
    name: 'id',
    required: true,
    description: "Isdentifiant de l'hébergement",
    example: '2012ea51-a884-4206-b7db-e29335180886',
  })
  @UseGuards(OwnershipGuard(Accommodation, 'owner'))
  @Patch('/:id')
  public updateAccommodation(
    @Param('id') id: string,
    @Body() patchAccommodationDto: PatchAccommodationDto,
  ) {
    return this.accommodationsService.update(id, patchAccommodationDto);
  }

  @ApiOperation({
    summary: 'Supprime un hébergement',
  })
  @ApiResponse({
    status: 200,
    description: "Réponse 200 lorsque l'hébergement est supprimé avec succès",
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: "Identifiant de l'hébergement",
    example: '20ee7a01-5dac-4902-8e04-2721d539b826',
  })
  @ApiBearerAuth('bearerAuth')
  @UseGuards(OwnershipGuard(Accommodation, 'owner'))
  @Delete('/:id')
  public deleteAccommodation(@Param('id') id: string) {
    return this.accommodationsService.delete(id);
  }
}
