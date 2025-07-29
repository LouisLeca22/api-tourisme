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
import { EventsService } from './providers/events.service';
import {
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateEventDto } from './dtos/create-event.dto';
import { PatchEventDto } from './dtos/patch-event.dto';

@Controller('events')
@ApiTags('Événemments')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @ApiOperation({
    summary: "Recupère la liste des événements enregistrées dans l'application",
  })
  @ApiResponse({
    status: 200,
    description: 'Évènements récupérés avec succès selon la requête.',
  })
  @ApiParam({
    name: 'ownerId',
    required: false,
    description: 'Récupére les événements associés à un propriétaire',
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
  public getEvents(
    @Query('limit', new DefaultValuePipe(3), ParseIntPipe) limit: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Param('ownerId') ownerId?: string,
  ) {
    return this.eventsService.findAll(limit, page, ownerId);
  }

  @ApiOperation({
    summary: 'Recupère un événement par son identifiant',
  })
  @ApiResponse({
    status: 200,
    description: 'Évènement récupéré avec succès selon la requête.',
  })
  @ApiParam({
    name: 'eventId',
    required: true,
    description: "identifiant de l'événement",
    example: 'c3919b85-e125-46b6-aee2-0d6a795e365e',
  })
  @Get('/single/:eventId')
  public getEvent(@Param('eventId') eventId: string) {
    return this.eventsService.findOne(eventId);
  }

  @ApiOperation({
    summary: 'Crée un nouvel événement',
  })
  @ApiResponse({
    status: 201,
    description: "Réponse 201 lorsque l'événement est créé avec succès",
  })
  @Post()
  public createEvent(@Body() createEventDto: CreateEventDto) {
    return this.eventsService.create(createEventDto);
  }

  @ApiOperation({
    summary: 'Modifie un événement',
  })
  @ApiResponse({
    status: 200,
    description: "Réponse 200 lorsque l'événement est modifié avec succès",
  })
  @Patch()
  public updateEvent(@Body() patchEventDto: PatchEventDto) {
    return this.eventsService.update(patchEventDto);
  }

  @ApiOperation({
    summary: 'Supprime un événement',
  })
  @ApiResponse({
    status: 200,
    description: "Réponse 200 lorsque l'événement est supprimé avec succès",
  })
  @ApiParam({
    name: 'eventId',
    required: true,
    description: "identifiant de l'évenement",
    example: 'c3919b85-e125-46b6-aee2-0d6a795e365e',
  })
  @Delete('/:eventId')
  public deleteEvent(@Param('eventId') eventId: string) {
    return this.eventsService.delete(eventId);
  }
}
