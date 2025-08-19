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
      if (
        !['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(
          file.mimetype,
        )
      ) {
        throw new BadRequestException("Ce format n'est pas supporté");
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
      console.log(error);
      throw new ConflictException(error);
    }
  }
}
