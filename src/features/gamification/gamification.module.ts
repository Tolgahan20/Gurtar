import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Gamification } from './entities/gamification.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Gamification])],
  controllers: [],
  providers: [],
})
export class GamificationModule {}
