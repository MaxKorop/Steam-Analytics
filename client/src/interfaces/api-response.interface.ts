interface FollowerData {
  date: string;
  followers: number;
}

interface Mention {
  title: string;
  created: string;
  selftext: string;
  author: string;
  ups: number;
  downs: number;
  numComments: number;
  permalink: string;
  subredditNamePrefixed: string;
  linkFlairText: string;
}

interface APIResponse {
  mentions: Mention[]
  followers: FollowerData[]
}

export { type APIResponse, type FollowerData, type Mention };