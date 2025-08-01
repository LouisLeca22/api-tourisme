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
import { ActivitiesService } from './providers/activities.service';
import { CreateActivityDto } from './dtos/create-activity.dto';
import { PatchActivityDto } from './dtos/patch-activity.dto';
import { CreateManyActivitiesDto } from './dtos/create-many-activities.dto';

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
  public getActivities(
    @Query('limit', new DefaultValuePipe(3), ParseIntPipe) limit: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Param('ownerId') ownerId?: string,
  ) {
    return this.activitiesService.findAll(limit, page, ownerId);
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
  @Post()
  public createActivity(@Body() createActivityDto: CreateActivityDto) {
    return this.activitiesService.create(createActivityDto);
  }

  @ApiOperation({
    summary: 'Crée plusieurs activités',
  })
  @ApiResponse({
    status: 201,
    description: 'Réponse 201 lorsque les activités ont été créées avec succès',
  })
  @Post('create-many')
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
  @Patch()
  public updateActivity(@Body() patchActivityDto: PatchActivityDto) {
    return this.activitiesService.update(patchActivityDto);
  }

  @ApiOperation({
    summary: 'Supprime une activité',
  })
  @ApiResponse({
    status: 200,
    description: "Réponse 200 lorsque l'activité est supprimée avec succès",
  })
  @ApiParam({
    name: 'activityId',
    required: true,
    description: "identifiant de l'activité",
    example: 'c3919b85-e125-46b6-aee2-0d6a795e365e',
  })
  @Delete('/:activityId')
  public deleteActivity(@Param('activityId') activityId: string) {
    return this.activitiesService.delete(activityId);
  }
}
