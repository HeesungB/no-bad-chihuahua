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
          }
        ];
      }
    ];
  };
}
