import axios from 'axios';
import { RewardResponse } from '../models/types';

export const getReward = async (apiUrl: string, address: string): Promise<RewardResponse> => {
  const response = await axios.get(`${apiUrl}/distribution/delegators/${address}/rewards`);
  return response.data as RewardResponse;
};
