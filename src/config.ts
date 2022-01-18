import { ChainInformation } from './models/types';

export const MNEMONIC = '';
export const PRIVATE_KEY = '';

export const COIN_TYPE = 118; // https://github.com/satoshilabs/slips/blob/master/slip-0044.md

export const SUPPORT_CHAIN_LIST: ChainInformation[] = [
  {
    name: 'chihuahua',
    ticker: 'HUAHUA',
    rpcUrl: 'https://rpc.chihuahua.wtf',
    apiUrl: 'https://api.chihuahua.wtf',
    prefix: 'chihuahua',
    demon: 'uhuahua',
    feeAmount: 10000,
    gasPrice: 200000,
  },
  {
    name: 'osmo',
    ticker: 'OSMOSIS',
    rpcUrl: 'https://rpc-osmosis.keplr.app',
    apiUrl: 'https://lcd-osmosis.keplr.app',
    prefix: 'osmo',
    demon: 'uosmo',
    feeAmount: 0,
    gasPrice: 250000,
  },
  {
    name: 'comdex',
    ticker: 'OSMOSIS',
    rpcUrl: 'https://rpc.comdex.one',
    apiUrl: 'https://rest.comdex.one',
    prefix: 'comdex',
    demon: 'ucmdx',
    feeAmount: 6000,
    gasPrice: 200000,
  },
];
