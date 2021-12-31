import { encodeSecp256k1Pubkey } from '@cosmjs/amino';
import { AccountData, DirectSecp256k1Wallet, encodePubkey, makeAuthInfoBytes, makeSignDoc } from '@cosmjs/proto-signing';
import { StargateClient } from '@cosmjs/stargate';
import { Account, ChainInformation, RawTx, Reward, SignedTx } from '../models/types';
import { TxRaw } from 'cosmjs-types/cosmos/tx/v1beta1/tx';
import { registry } from '../models/defaultRegistryTypes';
import BN from 'bn.js';

export const convertHexStringToBuffer = (hexString: string) => Buffer.from(hexString, 'hex');

export const getClient = async (rpcUrl: string): Promise<StargateClient> => {
  const client = await StargateClient.connect(rpcUrl);

  return client;
};

export const getAccount = async (privateKey: Buffer, chainInformation: ChainInformation): Promise<Account> => {
  const wallet = await DirectSecp256k1Wallet.fromKey(new Uint8Array(privateKey), chainInformation.prefix);
  const accounts = await wallet.getAccounts();
  const accountData: AccountData = accounts[0];

  return { address: accountData.address, publicKey: accountData.pubkey.toString() };
};

export const getTopValidatorAddress = (rewards: Reward[]): string => {
  const topValidator = { address: '', amount: '0' };

  for (const reward of rewards) {
    const rewardAmount = reward.reward[0].amount.split('.')[0];

    const topValidatorAmount = new BN(topValidator.amount, 10);
    const rewardAmountBN = new BN(rewardAmount, 10);

    if (rewardAmountBN.gt(topValidatorAmount)) {
      topValidator.address = reward.validator_address;
      topValidator.amount = rewardAmount;
    }
  }

  return topValidator.address;
};

export const createTxMessage = (
  chainInformation: ChainInformation,
  rewards: Reward[],
  delegatorAddress: string,
  topValidatorAddress: string
) => {
  let totalAmount = new BN(0);
  const messages = [];
  for (const reward of rewards) {
    totalAmount = totalAmount.add(new BN(reward.reward[0].amount.split('.')[0], 10));

    messages.push({
      typeUrl: '/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward',
      value: {
        delegatorAddress,
        validatorAddress: reward.validator_address,
      },
    });
  }

  messages.push({
    typeUrl: '/cosmos.staking.v1beta1.MsgDelegate',
    value: {
      delegatorAddress,
      validatorAddress: topValidatorAddress,
      amount: {
        amount: totalAmount.toString(),
        denom: chainInformation.demon,
      },
    },
  });

  return messages;
};

export const createTx = async (client: StargateClient, chainInformation: ChainInformation, delegatorAddress: string, messages: any[]) => {
  const sequence = await client.getSequence(delegatorAddress);
  const chainId = await client.getChainId();

  const rawTx: RawTx = {
    signerData: {
      accountNumber: `${sequence.accountNumber}`,
      sequence: sequence.sequence,
      chainId,
    },
    fee: {
      amount: [
        {
          denom: chainInformation.demon,
          amount: `${chainInformation.feeAmount * messages.length}`,
        },
      ],
      gas: `${chainInformation.gasPrice * messages.length}`,
    },
    memo: '',
    msgs: messages,
    sequence: `${sequence.sequence}`,
  };

  return rawTx;
};

export const signTx = async (privateKeyBuffer: Buffer, rawTx: RawTx, chainInformation: ChainInformation): Promise<SignedTx> => {
  const wallet = await DirectSecp256k1Wallet.fromKey(new Uint8Array(privateKeyBuffer), chainInformation.prefix);
  const accounts = await wallet.getAccounts();

  const txBodyEncodeObject = {
    typeUrl: '/cosmos.tx.v1beta1.TxBody',
    value: {
      messages: rawTx.msgs,
      memo: rawTx.memo,
    },
  };

  const txBodyBytes = registry.encode(txBodyEncodeObject);
  const pubkey = encodePubkey(encodeSecp256k1Pubkey(accounts[0].pubkey));

  const signDoc = makeSignDoc(
    txBodyBytes,
    makeAuthInfoBytes(
      [
        {
          pubkey,
          sequence: rawTx.signerData.sequence,
        },
      ],
      rawTx.fee.amount,
      rawTx.fee.gas
    ),
    rawTx.signerData.chainId,
    rawTx.signerData.accountNumber
  );

  const { signature } = await wallet.signDirect(accounts[0].address, signDoc);

  const txRaw = TxRaw.fromPartial({
    bodyBytes: signDoc.bodyBytes,
    authInfoBytes: signDoc.authInfoBytes,
    signatures: [new Uint8Array(Buffer.from(signature.signature, 'base64'))],
  });

  return { rawTx, signedTx: { txRaw } };
};

export const sendTx = async (client: StargateClient, signedTx: SignedTx): Promise<string> => {
  const txRawCall = signedTx.signedTx.txRaw;
  const txBytes = TxRaw.encode(txRawCall).finish();
  const response = await client.broadcastTx(txBytes);

  return response.transactionHash;
};
