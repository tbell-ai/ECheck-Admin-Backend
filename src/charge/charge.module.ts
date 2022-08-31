import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonChargeRepository } from './repository/charge.common.repository';
import { ChargeController } from './charge.controller';
import { DefaultChargeRepository } from './repository/charge.default.repository';
import { ElectChargeRepository } from './repository/charge.elect.repository';
import { ChargeService } from './charge.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DefaultChargeRepository,
      ElectChargeRepository,
      CommonChargeRepository,
    ]),
  ],
  controllers: [ChargeController],
  providers: [ChargeService],
  exports: [ChargeService],
})
export class ChargeModule {}
