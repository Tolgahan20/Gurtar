import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';

@Injectable()
export class TypedConfigService {
  constructor(private configService: NestConfigService) {}

  getAppConfig() {
    return {
      port: this.configService.get<number>('app.port') || 3000,
      environment:
        this.configService.get<string>('app.environment') || 'development',
      apiPrefix: this.configService.get<string>('app.apiPrefix') || 'api',
      cors: {
        origin:
          this.configService.get<string>('app.cors.origin') ||
          'http://localhost:3000',
        credentials: true,
      },
      swagger: {
        title:
          this.configService.get<string>('app.swagger.title') || 'Gurtar API',
        description:
          this.configService.get<string>('app.swagger.description') ||
          'Too Good To Go clone for Turkish Republic of North Cyprus',
        version:
          this.configService.get<string>('app.swagger.version') || '1.0.0',
        path: this.configService.get<string>('app.swagger.path') || 'docs',
      },
    };
  }

  getDatabaseConfig() {
    return this.configService.get('database');
  }

  getJwtConfig() {
    return this.configService.get('jwt');
  }
}
