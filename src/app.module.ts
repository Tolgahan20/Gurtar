import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import configurations from './config';
import { TypedConfigService } from './common/services/config.service';
import {
  AuthModule,
  UsersModule,
  BusinessesModule,
  CategoriesModule,
  PacketsModule,
  OrdersModule,
  PaymentsModule,
  RefundsModule,
  ComplaintsModule,
  FavoritesModule,
  ReviewsModule,
  GamificationModule,
  WalletsModule,
  AdminLogsModule,
} from './features';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: configurations,
      envFilePath: '.env',
    }),
    DatabaseModule,
    AuthModule,
    UsersModule,
    BusinessesModule,
    CategoriesModule,
    PacketsModule,
    OrdersModule,
    PaymentsModule,
    RefundsModule,
    ComplaintsModule,
    FavoritesModule,
    ReviewsModule,
    GamificationModule,
    WalletsModule,
    AdminLogsModule,
  ],
  controllers: [AppController],
  providers: [AppService, TypedConfigService],
})
export class AppModule {}
