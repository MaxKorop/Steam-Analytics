import { Injectable } from '@nestjs/common';
import { Mention, RedditAPIResponse } from 'src/interfaces/interfaces';

@Injectable()
export class SocialMediaService {
  private redditUrl: string = "https://oauth.reddit.com/search.json?q=";

  public async getMention(name: string): Promise<Mention[]> {

    const authString = `${process.env.APP_ID}:${process.env.APP_SECRET}`;
    const base64Auth = Buffer.from(authString).toString('base64');
    const headers = {
      'Authorization': `Basic ${base64Auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': process.env.USER_AGENT,
    };
    const body = new URLSearchParams({
      'grant_type': 'password',
      'username': process.env.REDDIT_USERNAME,
      'password': process.env.REDDIT_PASSWORD,
    });

    const accessTokenResponse = await fetch('https://www.reddit.com/api/v1/access_token', { method: 'POST', headers, body });

    const { access_token: accessToken } = await accessTokenResponse.json();
    
    headers['Authorization'] = `bearer ${accessToken}`;

    const response = await fetch(this.redditUrl + name, {
      method: 'GET',
      headers
    });
    const apiResponse = await response.json();

    const { data } = this.toCamelCase(apiResponse); 

    const mentions = data.children.map(mention => mention.data);

    return mentions;
  }

  private toCamelCase(apiResponse: any): RedditAPIResponse {
    return {
      data: {
        dist: apiResponse.data.dist,
        after: apiResponse.data.after,
        children: apiResponse.data.children.map((child: any) => ({
          data: {
            title: child.data.title,
            createdUtc: child.data.created_utc,
            selftext: child.data.selftext,
            author: child.data.author,
            ups: child.data.ups,
            downs: child.data.downs,
            numComments: child.data.num_comments,
            permalink: child.data.permalink,
            subredditNamePrefixed: child.data.subreddit_name_prefixed,
            linkFlairText: child.data.link_flair_text
          }
        })),
      },
    };
  }
}
