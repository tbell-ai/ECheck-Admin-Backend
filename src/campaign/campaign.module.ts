import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageFileRepository } from 'src/imagefile/imagefile.repository';
import { ImagefileService } from 'src/imagefile/imagefile.service';
import { CampaignController } from './campaign.controller';
import { CampaignRepository } from './campaign.repository';
import { CampaignService } from './campaign.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([CampaignRepository, ImageFileRepository]),
  ],
  controllers: [CampaignController],
  providers: [CampaignService, ImagefileService],
  exports: [CampaignService],
})
export class CampaignModule {}
