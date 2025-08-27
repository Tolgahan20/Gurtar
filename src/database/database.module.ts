import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BaseEntity } from './entities/base.entity';
import { DatabaseConfig } from '../config/database/database.config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const dbConfig = configService.get<DatabaseConfig>('database');
        return {
          ...dbConfig,
          entities: [BaseEntity],
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
