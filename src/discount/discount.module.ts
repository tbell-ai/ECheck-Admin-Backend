import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiscountController } from './discount.controller';
import { DiscountRepository } from './discount.repository';
import { DiscountService } from './discount.service';

@Module({
  imports: [TypeOrmModule.forFeature([DiscountRepository])],
  controllers: [DiscountController],
  providers: [DiscountService],
  exports: [DiscountService],
})
export class DiscountModule {}
