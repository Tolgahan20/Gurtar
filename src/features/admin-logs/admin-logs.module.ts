import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminLog } from './entities/admin-log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AdminLog])],
  controllers: [],
  providers: [],
})
export class AdminLogsModule {}
