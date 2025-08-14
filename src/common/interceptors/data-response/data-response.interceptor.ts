import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { map, Observable } from 'rxjs';
import { DataResponse } from 'src/common/interfaces/data-response.interface';

@Injectable()
export class DataResponseInterceptor implements NestInterceptor {
  constructor(private readonly configService: ConfigService) {}
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<DataResponse> {
    return next.handle().pipe(
      map((data: object) => ({
        apiVersion: this.configService.get('appConfig.apiVersion')!,
        data: data,
      })),
    );
  }
}
