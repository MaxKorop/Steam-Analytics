import { Controller, Get, Query } from '@nestjs/common';
import { StatsService } from './stats.service';
import { SocialMediaService } from './social-media.service';
import { RequestQuery } from 'src/interfaces/interfaces';

@Controller('stats')
export class StatsController {
  constructor(
    private readonly statsService: StatsService,
    private readonly socialMediaService: SocialMediaService
  ) { }

  @Get()
  async getStats(
    @Query() {
      name
    }: RequestQuery
  ) {
    return {
      mentions: await this.socialMediaService.getMention(name),
      followers: await this.statsService.getSteamSubscribers(name),
    };
  }
}
