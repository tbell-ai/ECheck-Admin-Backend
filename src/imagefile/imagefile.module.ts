import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageFileRepository } from './imagefile.repository';
import { ImagefileService } from './imagefile.service';

@Module({
  imports: [TypeOrmModule.forFeature([ImageFileRepository])],
  providers: [ImagefileService],
  exports: [ImagefileService],
})
export class ImagefileModule {}
