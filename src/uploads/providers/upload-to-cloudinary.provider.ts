import { Injectable } from '@nestjs/common';
import { UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';
import { Readable } from 'stream';
import { getCloudinary } from 'src/config/cloudinary.config';

@Injectable()
export class UploadToCloudinaryProvider {
  private cloudinary = getCloudinary(); // configure here, after env is loaded

  public async fileUpload(
    file: Express.Multer.File,
  ): Promise<{ path: string; name: string }> {
    return new Promise((resolve, reject) => {
      const uploadStream = this.cloudinary.uploader.upload_stream(
        {
          folder: 'uploads',
          resource_type: 'image',
        },
        (error: UploadApiErrorResponse, result: UploadApiResponse) => {
          if (error) {
            return reject(new Error(error.message));
          }
          if (!result) {
            return reject(new Error('Cloudinary did not return a result'));
          }
          resolve({
            path: result.secure_url,
            name: result.public_id,
          });
        },
      );

      Readable.from(file.buffer).pipe(uploadStream);
    });
  }
}
