import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiHeaders,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { Express } from 'express';
import { UploadsService } from './providers/uploads.service';

@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadService: UploadsService) {}

  @ApiHeaders([
    { name: 'Content-Type', description: 'multipart/form-data' },
    { name: 'Authorization', description: 'Bearer Token' },
  ])
  @ApiOperation({
    summary: 'Téléverse une image sur le serveur',
    description:
      'Permet de téléverser une image (JPEG, PNG, WebP) de maximum **1 MB**. ' +
      'Un token JWT Bearer est requis dans l’en-tête `Authorization`.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Image à uploader (jpeg, png, webp)',
        },
      },
    },
    examples: {
      ExempleUpload: {
        summary: 'Exemple de requête avec cURL',
        value: {
          file: 'test-image.jpg',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Image téléversée avec succès',
    schema: {
      example: {
        id: 'uuid-generated',
        name: 'test-image.jpg',
        path: 'https://res.cloudinary.com/demo/image/upload/v1699999999/test-image.jpg',
        type: 'image',
        mime: 'image/jpeg',
        size: 123456,
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  @Post('file')
  public uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.uploadService.uploadFile(file);
  }
}
