import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Upload } from '../upload.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UploadToCloudinaryProvider } from './upload-to-cloudinary.provider';
import { FileType } from '../enums/file-type.enum';
import { UploadFile } from '../inteerfaces/upload-file.interface';

@Injectable()
export class UploadsService {
  constructor(
    @InjectRepository(Upload)
    private readonly uploadRepository: Repository<Upload>,
    private readonly uploadToCloudinaryProvider: UploadToCloudinaryProvider,
  ) {}
  public async uploadFile(file: Express.Multer.File) {
    try {
      if (!file) {
        throw new BadRequestException('Aucun fichier envoyé');
      }
      if (
        !['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(
          file.mimetype,
        )
      ) {
        throw new BadRequestException("Ce format n'est pas supporté");
      }

      if (file.size > 1 * 1024 * 1024) {
        throw new BadRequestException(
          'Le fichier est trop volumineux (max 1MB)',
        );
      }

      const { path, name } =
        await this.uploadToCloudinaryProvider.fileUpload(file);

      const uploadFile: UploadFile = {
        name,
        path,
        type: FileType.IMAGE,
        mime: file.mimetype,
        size: file.size,
      };

      const upload = this.uploadRepository.create(uploadFile);
      return await this.uploadRepository.save(upload);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      if (error instanceof Error) {
        throw new ConflictException(
          error.message || 'Impossible de téléverser le fichier',
        );
      }
    }
  }
}
