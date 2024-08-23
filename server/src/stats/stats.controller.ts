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
      name,
      from,
      to
    }: RequestQuery
  ) {
    const followers = await this.statsService.getSteamSubscribers(name, from, to);
    const mentions = await this.socialMediaService.getMention(name,
      followers[0].date,
      followers[followers.length - 1].date
    );

    return {
      mentions,
      followers,
    };
  }
}
