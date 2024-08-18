import { Module } from '@nestjs/common';
import { StatsController } from './stats.controller';
import { StatsService } from './stats.service';
import { SocialMediaService } from './social-media.service';

@Module({
  controllers: [StatsController],
  providers: [StatsService, SocialMediaService]
})
export class StatsModule {}
