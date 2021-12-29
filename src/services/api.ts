import axios from 'axios';
import { HuauaRewardResponse } from '../models/types';

export const getReward = async (address: string): Promise<HuauaRewardResponse> => {
  const response = await axios.get(`https://api.chihuahua.wtf/distribution/delegators/${address}/rewards`);
  return response.data as HuauaRewardResponse;
};
