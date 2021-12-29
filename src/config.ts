import { ChainInformation } from './types/types';

export const MNEMONIC = '';
export const PRIVATE_KEY = '';

export const COIN_TYPE = 118; // https://github.com/satoshilabs/slips/blob/master/slip-0044.md

export const GAS_PRICE = 210000;

export const SELECTED_CHAIN = 'chihuahua';

export const SUPPORT_CHAIN_LIST: ChainInformation[] = [
  {
    name: 'chihuahua',
    rpcUrl: 'https://rpc.chihuahua.wtf',
    prefix: 'chihuahua',
    demon: 'uhuahua',
    feeAmount: '7000',
  },
];
