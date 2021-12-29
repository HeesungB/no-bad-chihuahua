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

export interface HuauaRewardResponse {
  height: string;
  result: {
    rewards: [
      {
        validator_address: string;
        reward: [
          {
            denom: string;
            amount: string;
          },
        ];
      },
    ];
  };
}

export interface ChainInformation {
  name: string;
  ticker: ChainType;
  rpcUrl: string;
  prefix: string;
  demon: string;
  feeAmount: string;
}

export type ChainType = 'HUAHUA' | 'OSMOSIS';

export type AuthType = 'mnemonic' | 'privateKey';

export interface PromptAnswers {
  chainType: ChainType;
  authType: AuthType;
  authString: string;
  continueFlag: boolean;
}
