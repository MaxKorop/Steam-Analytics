export interface APIResponse {
  success: boolean;
  data: {
    start: number;
    step: number;
    values: number[];
  }
}