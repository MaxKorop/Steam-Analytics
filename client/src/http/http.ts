import axios, { AxiosError } from "axios";
import { APIResponse, DateFilter } from "../interfaces/interfaces";
import { ResponseError } from "../exceptions/exceptions";

const getGameStats = async (name: string, dateFilter: DateFilter): Promise<APIResponse> => {
  try {
    const { from, to } = dateFilter;

    const searchParams = new URLSearchParams(`name=${name}`);
    if (from) searchParams.append('from', from);
    if (to) searchParams.append('to', to);

    const { data } = await axios.get<APIResponse>(`${import.meta.env.VITE_API_URL}/stats?${searchParams.toString()}`);
    
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw (error as AxiosError<ResponseError>).response?.data || error;
    }
    throw error;
  }
};

export { getGameStats };