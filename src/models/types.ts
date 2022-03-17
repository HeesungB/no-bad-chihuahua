export interface BIP44 {
  type: number;
  account: number;
  index: number;
  prefix: string;
}

export interface Account {
  address: string;
  publicKey: string;
}

export interface RawTx {
  [key: string]: any;
}

export interface SignedTx {
  rawTx: RawTx;
  signedTx?: any;
}

export interface ChainInformation {
  name: string;
  ticker: ChainType;
  apiUrl: string;
  rpcUrl: string;
  prefix: string;
  demon: string;
  feeAmount: number;
  gasPrice: number;
}

export type ChainType = 'HUAHUA' | 'OSMOSIS' | 'CRBRUS';

export type AuthType = 'mnemonic' | 'privateKey';

export interface PromptAnswers {
  chainType: ChainType;
  authType: AuthType;
  authString: string;
  continueFlag: boolean;
}

export interface Reward {
  validator_address: string;
  reward: RewardAmount[];
}

export interface RewardAmount {
  denom: string;
  amount: string;
}

export interface RewardResponse {
  height: string;
  result: {
    rewards: Reward[];
  };
}
