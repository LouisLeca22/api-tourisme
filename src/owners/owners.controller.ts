import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  DefaultValuePipe,
  Query,
  Post,
  Body,
  Patch,
  Delete,
} from '@nestjs/common';
import { CreateOwnerDto } from './dtos/create-owner.dto';
import { PatchOwnerDto } from './dtos/patch-owner.dto';
import { OwnersService } from './providers/owners.service';
import {
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateManyOwnersDto } from './dtos/create-mny-owners.dto';

@Controller('owners')
@ApiTags('Propriétaires')
export class OwnersController {
  constructor(private readonly ownersService: OwnersService) {}

  @ApiOperation({
    summary:
      "Recupère une liste de propriétéaires enregistrés par l'application",
  })
  @ApiResponse({
    status: 200,
    description: 'Utilisateurs récupérés avec succès selon la requête.',
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
  @Get('')
  public getOwners(
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  ) {
    return this.ownersService.findAll(limit, page);
  }

  @ApiOperation({
    summary: 'Recupère un propriétaire par son identifiant',
  })
  @ApiResponse({
    status: 200,
    description: 'Propriétaire récupéré avec succès selon la requête.',
  })
  @ApiParam({
    name: 'ownerId',
    required: true,
    description: 'identifiant du propriétaire',
    example: 'c3919b85-e125-46b6-aee2-0d6a795e365e',
  })
  @Get('/single/:ownerId')
  public getOwner(@Param('ownerId') eventId: string) {
    return this.ownersService.findOne(eventId);
  }

  @ApiOperation({
    summary: 'Crée un nouveau propriétaire',
  })
  @ApiResponse({
    status: 201,
    description: 'Réponse 201 lorsque le propriétaire a été créé avec succès',
  })
  @Post()
  public createOwner(@Body() createOwnerDto: CreateOwnerDto) {
    return this.ownersService.create(createOwnerDto);
  }

  @ApiOperation({
    summary: 'Crée plusieurs propriétaires',
  })
  @ApiResponse({
    status: 201,
    description:
      'Réponse 201 lorsque les propriétaires ont été créés avec succès',
  })
  @Post('create-many')
  public createManyOwners(@Body() createManyOwnersDto: CreateManyOwnersDto) {
    return this.ownersService.createMany(createManyOwnersDto);
  }

  @ApiOperation({
    summary: 'Met à jour un propriétaire',
  })
  @ApiResponse({
    status: 200,
    description:
      'Réponse 200 lorsque le propriétaire a été modifié avec succès',
  })
  @Patch()
  public patchOwner(@Body() patchOwnerDto: PatchOwnerDto) {
    return this.ownersService.update(patchOwnerDto);
  }

  @ApiOperation({
    summary: 'Supprime un propriétaire',
  })
  @ApiResponse({
    status: 200,
    description: 'Réponse 200 lorsque le propriétaire est supprimé avec succès',
  })
  @ApiParam({
    name: 'ownerId',
    required: true,
    description: 'identifiant du propriétaire',
    example: 'c3919b85-e125-46b6-aee2-0d6a795e365e',
  })
  @Delete('/:ownerId')
  public deleteOwner(@Param('ownerId') ownerId: string) {
    return this.ownersService.delete(ownerId);
  }
}
