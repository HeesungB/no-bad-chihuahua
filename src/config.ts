import { ChainInformation } from './models/types';

export const cycleTime = '*/1 * * * *'; // 1 minute example
// *    *    *    *    *    *
// ┬    ┬    ┬    ┬    ┬    ┬
// │    │    │    │    │    │
// │    │    │    │    │    └ day of week (0 - 7) (0 or 7 is Sun)
// │    │    │    │    └───── month (1 - 12)
// │    │    │    └────────── day of month (1 - 31)
// │    │    └─────────────── hour (0 - 23)
// │    └──────────────────── minute (0 - 59)
// └───────────────────────── second (0 - 59, OPTIONAL)
// https://www.npmjs.com/package/node-schedule

export const COIN_TYPE = 118; // https://github.com/satoshilabs/slips/blob/master/slip-0044.md

export const SUPPORT_CHAIN_LIST: ChainInformation[] = [
  {
    name: 'chihuahua',
    ticker: 'HUAHUA',
    rpcUrl: 'https://rpc.chihuahua.wtf',
    apiUrl: 'https://api.chihuahua.wtf',
    prefix: 'chihuahua',
    demon: 'uhuahua',
    feeAmount: 7000,
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
  {
    name: 'ceberus',
    ticker: 'CRBRUS',
    rpcUrl: 'https://rpc.cerberus.zone:26657',
    apiUrl: 'https://api.cerberus.zone:1317',
    prefix: 'cerberus',
    demon: 'ucrbrus',
    feeAmount: 6000,
    gasPrice: 200000,
  },
];
