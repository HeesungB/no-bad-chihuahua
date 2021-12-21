import axios, { AxiosResponse } from 'axios';
import { HuauaRewardResponse } from '../types/types';

export const getReward = async (address: string): Promise<HuauaRewardResponse> => {
  const response = await axios.get(`https://api.chihuahua.wtf/distribution/delegators/${address}/rewards`);
  return response.data as HuauaRewardResponse;
};
