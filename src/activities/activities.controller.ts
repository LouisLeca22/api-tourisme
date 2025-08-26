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
import { ActivitiesService } from './providers/activities.service';
import { CreateActivityDto } from './dtos/create-activity.dto';
import { PatchActivityDto } from './dtos/patch-activity.dto';
import { CreateManyActivitiesDto } from './dtos/create-many-activities.dto';
import { PaginationQueryDto } from 'src/common/pagination/dtos/pagination-query.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { AuthType } from 'src/auth/enums/auth-type.enum';
import { ActiveUser } from 'src/auth/decorators/active-user.decorator';
import { ActiveUserData } from 'src/auth/interfaces/active-user-data.interface';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RoleType } from 'src/auth/enums/role-types.enum';
import { OwnershipGuard } from 'src/auth/guards/ownership/ownership.guard';
import { Activity } from './activity.entity';

@Controller('activities')
@ApiTags('Activités')
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @ApiOperation({
    summary: "Recupère la liste des activités enregistrées dans l'application",
  })
  @ApiResponse({
    status: 200,
    description: 'Activités récupérées avec succès selon la requête.',
  })
  @ApiParam({
    name: 'ownerId',
    required: false,
    description: 'Récupére les activités associées à un propriétaire',
    example: '06f54380-4636-4aed-8953-def85d70f1f5',
  })
  @ApiQuery({
    name: 'limit',
    type: 'number',
    required: false,
    description: "Nombre d'entrées retournées par requête",
    example: 10,
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
  public getActivities(
    @Query() activitiesQuery: PaginationQueryDto,
    @Param('ownerId') ownerId?: string,
  ) {
    return this.activitiesService.findAll(activitiesQuery, ownerId);
  }

  @ApiOperation({
    summary: 'Recupère une activité par son identifiant',
  })
  @ApiResponse({
    status: 200,
    description: 'Activité récupérée avec succès selon la requête.',
  })
  @ApiParam({
    name: 'activityId',
    required: true,
    description: "identifiant de l'activité",
    example: 'c3919b85-e125-46b6-aee2-0d6a795e365e',
  })
  @Auth(AuthType.None)
  @Get('/single/:activityId')
  public getActivity(@Param('activityId') activityId: string) {
    return this.activitiesService.findOne(activityId);
  }

  @ApiOperation({
    summary: 'Crée une nouvelle activité',
  })
  @ApiResponse({
    status: 201,
    description: "Réponse 201 lorsque l'activité est créée avec succès",
  })
  @ApiBearerAuth('bearerAuth')
  @Post()
  public createActivity(
    @Body() createActivityDto: CreateActivityDto,
    @ActiveUser() user: ActiveUserData,
  ) {
    return this.activitiesService.create(createActivityDto, user);
  }

  @ApiOperation({
    summary: 'Crée plusieurs activités',
    description: 'Cette route est réservée aux administrateurs',
  })
  @ApiResponse({
    status: 201,
    description: 'Réponse 201 lorsque les activités ont été créées avec succès',
  })
  @ApiBearerAuth('bearerAuth')
  @Post('create-many')
  @Roles(RoleType.Admin)
  public createManyActivities(
    @Body() createManyActivitiesDto: CreateManyActivitiesDto,
  ) {
    return this.activitiesService.createMany(createManyActivitiesDto);
  }

  @ApiOperation({
    summary: 'Modifie une activité',
  })
  @ApiResponse({
    status: 200,
    description: "Réponse 200 lorsque l'activité est modifiée avec succès",
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: "identifiant de l'activité",
    example: 'c3919b85-e125-46b6-aee2-0d6a795e365e',
  })
  @ApiBearerAuth('bearerAuth')
  @UseGuards(OwnershipGuard(Activity, 'owner'))
  @Patch('/:id')
  public updateActivity(
    @Param('id') id: string,
    @Body() patchActivityDto: PatchActivityDto,
  ) {
    return this.activitiesService.update(id, patchActivityDto);
  }

  @ApiOperation({
    summary: 'Supprime une activité',
  })
  @ApiResponse({
    status: 200,
    description: "Réponse 200 lorsque l'activité est supprimée avec succès",
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: "identifiant de l'activité",
    example: 'c3919b85-e125-46b6-aee2-0d6a795e365e',
  })
  @ApiBearerAuth('bearerAuth')
  @UseGuards(OwnershipGuard(Activity, 'owner'))
  @Delete('/:id')
  public deleteActivity(@Param('id') id: string) {
    return this.activitiesService.delete(id);
  }
}
