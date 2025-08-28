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
import { EventsService } from './providers/events.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateEventDto } from './dtos/create-event.dto';
import { PatchEventDto } from './dtos/patch-event.dto';
import { CreateManyEventsDto } from './dtos/create-many-events.dto';
import { GetEventsDto } from './dtos/get-events.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { AuthType } from 'src/auth/enums/auth-type.enum';
import { ActiveUser } from 'src/auth/decorators/active-user.decorator';
import { ActiveUserData } from 'src/auth/interfaces/active-user-data.interface';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RoleType } from 'src/auth/enums/role-types.enum';
import { OwnershipGuard } from 'src/auth/guards/ownership/ownership.guard';
import { Event } from './event.entity';

@Controller('events')
@ApiTags('Événemments')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @ApiOperation({
    summary: "Recupère la liste des événements enregistrés dans l'application",
  })
  @ApiResponse({
    status: 200,
    description: 'Évènements récupérés avec succès selon la requête',
  })
  @ApiParam({
    name: 'ownerId',
    required: false,
    description: 'Récupére les événements associés à un propriétaire',
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
  @ApiQuery({
    name: 'startDate',
    type: 'string',
    required: false,
    description: "date de début de l'événement",
    example: 'Mon May 12 2025 18:00:30',
  })
  @ApiQuery({
    name: 'endDate',
    type: 'string',
    required: false,
    description: "date de début de l'événement",
    example: 'Sun Sep 28 2025 02:00:00',
  })
  @Auth(AuthType.None)
  @Get('{/:ownerId}')
  public getEvents(
    @Query() eventsQuery: GetEventsDto,
    @Param('ownerId') ownerId?: string,
  ) {
    return this.eventsService.findAll(eventsQuery, ownerId);
  }

  @ApiOperation({
    summary: 'Recupère un événement par son identifiant',
  })
  @ApiResponse({
    status: 200,
    description: 'Évènement récupéré avec succès selon la requête',
  })
  @ApiParam({
    name: 'eventId',
    required: true,
    description: "Identifiant de l'événement",
    example: 'd4ddcfd6-87e2-4ef1-849d-1e8cee2d5252',
  })
  @Auth(AuthType.None)
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
  @ApiBearerAuth('bearerAuth')
  @Post()
  public createEvent(
    @Body() createEventDto: CreateEventDto,
    @ActiveUser() user: ActiveUserData,
  ) {
    return this.eventsService.create(createEventDto, user);
  }

  @ApiOperation({
    summary: 'Crée plusieurs événements',
    description: 'Cette route est réservée aux administrateurs',
  })
  @ApiResponse({
    status: 201,
    description: 'Réponse 201 lorsque les événements ont été créés avec succès',
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: "Identifiant de l'événement",
    example: '3bc631c7-02a6-4cf0-a59c-695315b5c361',
  })
  @ApiBearerAuth('bearerAuth')
  @Roles(RoleType.Admin)
  @Post('create-many')
  public createManyEvents(@Body() createManyEventsDto: CreateManyEventsDto) {
    return this.eventsService.createMany(createManyEventsDto);
  }

  @ApiOperation({
    summary: 'Modifie un événement',
  })
  @ApiResponse({
    status: 200,
    description: "Réponse 200 lorsque l'événement est modifié avec succès",
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: "Identifiant de l'événement",
    example: '3bc631c7-02a6-4cf0-a59c-695315b5c361',
  })
  @ApiBearerAuth('bearerAuth')
  @UseGuards(OwnershipGuard(Event, 'owner'))
  @Patch('/:id')
  public updateEvent(
    @Param('id') id: string,
    @Body() patchEventDto: PatchEventDto,
  ) {
    return this.eventsService.update(id, patchEventDto);
  }

  @ApiOperation({
    summary: 'Supprime un événement',
  })
  @ApiResponse({
    status: 200,
    description: "Réponse 200 lorsque l'événement est supprimé avec succès",
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: "Identifiant de l'événement",
    example: '3a5c0f87-7e19-4a62-aec9-8f2b2f92e94f',
  })
  @ApiBearerAuth('bearerAuth')
  @UseGuards(OwnershipGuard(Event, 'owner'))
  @Delete('/:id')
  public deleteEvent(@Param('id') id: string) {
    return this.eventsService.delete(id);
  }
}
