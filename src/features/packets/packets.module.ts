import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Packet } from './entities/packet.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Packet])],
  controllers: [],
  providers: [],
})
export class PacketsModule {}
