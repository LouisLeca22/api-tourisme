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
    description: 'Hébergements récupérés avec succès selon la requête.',
  })
  @ApiParam({
    name: 'ownerId',
    required: false,
    description: 'Récupére les hébergements associés à un propriétaire',
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
    description: "identifiant de l'hébergement",
    example: 'c3919b85-e125-46b6-aee2-0d6a795e365e',
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
    description: "identifiant de l'hébergement",
    example: 'c3919b85-e125-46b6-aee2-0d6a795e365e',
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
    description: "identifiant de l'hébergement",
    example: 'c3919b85-e125-46b6-aee2-0d6a795e365e',
  })
  @ApiBearerAuth('bearerAuth')
  @UseGuards(OwnershipGuard(Accommodation, 'owner'))
  @Delete('/:id')
  public deleteAccommodation(@Param('id') id: string) {
    return this.accommodationsService.delete(id);
  }
}
