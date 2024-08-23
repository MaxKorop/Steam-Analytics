import { Mention } from "./api-response.interface";

interface DataPoint {
  date: string;
  followers: number;
  mention?: Mention;
}

export { type DataPoint };