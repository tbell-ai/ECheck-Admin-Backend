import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeORMConfig } from './configs/typeorm.config';

import { UserModule } from './user/user.module';
import { AuthMiddleware } from './middleware/auth.middleware';
import { UserController } from './user/user.controller';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './auth/guards/roles.guard';
import { ChargeModule } from './charge/charge.module';
import { AuthController } from './auth/auth.controller';
import { ChargeController } from './charge/charge.controller';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { VersionModule } from './version/version.module';
import { VersionController } from './version/version.controller';
import { FaqModule } from './faq/faq.module';
import { FaqController } from './faq/faq.controller';
import { ContractModule } from './contract/contract.module';
import { ContractController } from './contract/contract.controller';
import { DiscountModule } from './discount/discount.module';
import { DiscountController } from './discount/discount.controller';
import { CampaignModule } from './campaign/campaign.module';
import { ImagefileModule } from './imagefile/imagefile.module';
import { CampaignController } from './campaign/campaign.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeORMConfig), // TypeORM 설정 파일 연결
    UserModule,
    AuthModule,
    ChargeModule,
    VersionModule,
    FaqModule,
    ContractModule,
    DiscountModule,
    CampaignModule,
    ImagefileModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware) // 인증 미들웨어를 등록
      .exclude(
        { path: 'user/check_user', method: RequestMethod.GET },
        { path: 'user/create_user', method: RequestMethod.POST },
        { path: 'auth/login', method: RequestMethod.POST },
      ) // 해당 Resource Path 인증 미들웨어에서 제외
      .forRoutes(
        UserController,
        AuthController,
        ChargeController,
        VersionController,
        FaqController,
        ContractController,
        DiscountController,
        CampaignController,
      ) // 인증 미들웨어가 적용될 컨트롤러 등록
      .apply(LoggerMiddleware) // 로깅 미들웨어를 등록
      .forRoutes('*'); // 로깅 미들웨어가 적용될 컨트롤러 등록
  }
}
