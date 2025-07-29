import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
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
import { AccommodationsService } from './providers/acommodations.service';
import { CreateAccommodationDto } from './dtos/create-accommodation-dto';
import { PatchAccommodationDto } from './dtos/patch-accommodation-dto';

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
  public getAccommodations(
    @Query('limit', new DefaultValuePipe(3), ParseIntPipe) limit: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Param('ownerId') ownerId?: string,
  ) {
    return this.accommodationsService.findAll(limit, page, ownerId);
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
  public createAccommodation(
    @Body() createAccommodationDto: CreateAccommodationDto,
  ) {
    return this.accommodationsService.create(createAccommodationDto);
  }

  @ApiOperation({
    summary: 'Modifie un hébergement',
  })
  @ApiResponse({
    status: 200,
    description: "Réponse 200 lorsque l'hébergement est modifié avec succès",
  })
  @Patch()
  public updateAccommodation(
    @Body() patchAccommodationDto: PatchAccommodationDto,
  ) {
    return this.accommodationsService.update(patchAccommodationDto);
  }

  @ApiOperation({
    summary: 'Supprime un hébergement',
  })
  @ApiResponse({
    status: 200,
    description: "Réponse 200 lorsque l'hébergement est supprimé avec succès",
  })
  @ApiParam({
    name: 'accommodationId',
    required: true,
    description: "identifiant de l'hébergement",
    example: 'c3919b85-e125-46b6-aee2-0d6a795e365e',
  })
  @Delete('/:accommodationId')
  public deleteAccommodation(
    @Param('accommodationId') accommodationId: string,
  ) {
    return this.accommodationsService.delete(accommodationId);
  }
}
