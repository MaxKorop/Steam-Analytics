import { Injectable, NotFoundException } from '@nestjs/common';
import puppeteer, { Browser, Page } from 'puppeteer';
import { PuppeteerExtra } from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { AppFromList, Point, SteamAPIResponse } from 'src/interfaces/interfaces';

@Injectable()
export class StatsService {
  public async getSteamSubscribers(name: string, from?: string, to?: string): Promise<Point[]> {
    const { applist: appList } = await fetch('https://api.steampowered.com/ISteamApps/GetAppList/v2/').then(response => response.json());
    
    const gameId: number = await this.getGameSteamId(name, appList);
    const url: string = this.getSteamDbUrl(gameId);
    
    const statsData: SteamAPIResponse = await this.getStats(url);

    const formattedStats: Point[] = this.formatStats(statsData);
    
    return from || to ? this.filterStats(formattedStats, from, to) : formattedStats;
  }

  private async getGameSteamId(gameName: string, appList: { apps: AppFromList[] }): Promise<number> {
    const app: AppFromList | undefined = appList.apps.find((app) => app.name === gameName);
    
    if (!app) {
      throw new NotFoundException("Game not found")
    }

    return app.appid;
  }

  private getSteamDbUrl(id: number): string {
    return `https://steamdb.info/app/${id}/charts/#followers`;
  }

  private async getStats(url: string): Promise<SteamAPIResponse> {
    const puppeteerExtra: PuppeteerExtra = new PuppeteerExtra(puppeteer);
    puppeteerExtra.use(StealthPlugin());
  
    const browser: Browser = await puppeteerExtra.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/google-chrome',
    });
  
    const page: Page = await browser.newPage();
  
    await page.setJavaScriptEnabled(true);
    await page.setViewport({ width: 1200, height: 800, deviceScaleFactor: 1, isMobile: false });
  
    let chartData: { success: boolean, data: { start: number, step: number, values: number[] } };
  
    page.on('response', async (response) => {
      if (response.url().includes('/api/GetGraphFollowers')) {
        chartData = await response.json();
      }
    });
    
    await page.goto(url, { waitUntil: 'networkidle2' });
  
    await page.close();
    await browser.close();
  
    return chartData;
  }

  private formatStats(stats: SteamAPIResponse): Point[] {
    const { start, step, values } = stats.data;

    const result: Point[] = values.map((value, i) => {
      const date = new Date(start * 1000 + i * step * 1000).toISOString().slice(0, 10); // Transforming UNIX timestamps
      return { date, followers: value };
    });
    
    return result;
  }

  private filterStats(followersData: Point[], from?: string, to?: string): Point[] {
    return followersData.filter(followersPoint => {

      if (from && to) {
        return new Date(followersPoint.date).getTime() > new Date(from).getTime()
          && new Date(followersPoint.date).getTime() < new Date(to).getTime(); 
      } else if (from) {
        return new Date(followersPoint.date).getTime() > new Date(from).getTime(); 
      } if (to) {
        return new Date(followersPoint.date).getTime() < new Date(to).getTime(); 
      }
    })
  }
}
