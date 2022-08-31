import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FaqController } from './faq.controller';
import { FaqRepository } from './faq.repository';
import { FaqService } from './faq.service';

@Module({
  imports: [TypeOrmModule.forFeature([FaqRepository])],
  controllers: [FaqController],
  providers: [FaqService],
  exports: [FaqService],
})
export class FaqModule {}
