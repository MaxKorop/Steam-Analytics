export interface Mention {
  title: string;
  createdUtc: number;
  selftext: string;
  author: string;
  ups: number;
  downs: number;
  numComments: number;
  permalink: string;
  subredditNamePrefixed: string;
  linkFlairText: string | null
}