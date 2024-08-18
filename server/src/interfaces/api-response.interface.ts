import { Mention } from "./interfaces";

export interface SteamAPIResponse {
  success: boolean;
  data: {
    start: number;
    step: number;
    values: number[];
  }
}

export interface RedditAPIResponse {
  data: {
    dist: number;
    after: string;
    children: Array<{
      data: Mention
    }>
  }
}