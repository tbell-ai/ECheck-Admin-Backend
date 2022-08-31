import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VersionController } from './version.controller';
import { VersionRepository } from './version.repository';
import { VersionService } from './version.service';

@Module({
  imports: [TypeOrmModule.forFeature([VersionRepository])],
  controllers: [VersionController],
  providers: [VersionService],
  exports: [VersionService],
})
export class VersionModule {}
