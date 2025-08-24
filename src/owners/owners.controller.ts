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
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { CreateOwnerDto } from './dtos/create-owner.dto';
import { PatchOwnerDto } from './dtos/patch-owner.dto';
import { OwnersService } from './providers/owners.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateManyOwnersDto } from './dtos/create-mny-owners.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { AuthType } from 'src/auth/enums/auth-type.enum';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RoleType } from 'src/auth/enums/role-types.enum';
import { ActiveUserData } from 'src/auth/interfaces/active-user-data.interface';
import { ActiveUser } from 'src/auth/decorators/active-user.decorator';

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
  @Auth(AuthType.None)
  @Get()
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
  @Auth(AuthType.None)
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
  @Auth(AuthType.None)
  @UseInterceptors(ClassSerializerInterceptor)
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
  @ApiBearerAuth('bearerAuth')
  @Roles(RoleType.Admin)
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
  @ApiBearerAuth('bearerAuth')
  @Patch()
  public patchOwner(
    @Body() patchOwnerDto: PatchOwnerDto,
    @ActiveUser() user: ActiveUserData,
  ) {
    return this.ownersService.update(patchOwnerDto, user);
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
  @ApiBearerAuth('bearerAuth')
  @Delete('/:ownerId')
  public deleteOwner(
    @Param('ownerId') ownerId: string,
    @ActiveUser() user: ActiveUserData,
  ) {
    return this.ownersService.delete(ownerId, user);
  }
}
