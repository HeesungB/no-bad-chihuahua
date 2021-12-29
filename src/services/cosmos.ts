import { encodeSecp256k1Pubkey } from '@cosmjs/amino';
import { AccountData, DirectSecp256k1Wallet, encodePubkey, makeAuthInfoBytes, makeSignDoc } from '@cosmjs/proto-signing';
import { StargateClient } from '@cosmjs/stargate';
import { Account, ChainInformation, RawTx, SignedTx } from '../types/types';
import { TxRaw } from 'cosmjs-types/cosmos/tx/v1beta1/tx';
import { registry } from '../types/defaultRegistryTypes';
import { GAS_PRICE } from '../config';

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

export const createClaimAndDelegateRawTx = async (
  client: StargateClient,
  delegatorAddress: string,
  validatorAddress: string,
  amount: string,
  chainInformation: ChainInformation
): Promise<RawTx> => {
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
          amount: chainInformation.feeAmount,
        },
      ],
      gas: GAS_PRICE,
    },
    memo: '',
    msgs: [
      {
        typeUrl: '/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward',
        value: {
          delegatorAddress,
          validatorAddress,
        },
      },
      {
        typeUrl: '/cosmos.staking.v1beta1.MsgDelegate',
        value: {
          delegatorAddress,
          validatorAddress,
          amount: {
            amount,
            denom: chainInformation.demon,
          },
        },
      },
    ],
    sequence: `${sequence.sequence}`,
  };

  return rawTx;
};

export const createClaimRawTx = async (
  client: StargateClient,
  delegatorAddress: string,
  validatorAddress: string,
  chainInformation: ChainInformation
): Promise<RawTx> => {
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
          amount: chainInformation.feeAmount,
        },
      ],
      gas: GAS_PRICE,
    },
    memo: '',
    msgs: [
      {
        typeUrl: '/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward',
        value: {
          delegatorAddress,
          validatorAddress,
        },
      },
    ],
    sequence: `${sequence.sequence}`,
  };

  return rawTx;
};

export const createDelegateRawTx = async (
  client: StargateClient,
  delegatorAddress: string,
  validatorAddress: string,
  amount: string,
  chainInformation: ChainInformation
): Promise<RawTx> => {
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
          amount: chainInformation.feeAmount,
        },
      ],
      gas: GAS_PRICE,
    },
    memo: '',
    msgs: [
      {
        typeUrl: '/cosmos.staking.v1beta1.MsgDelegate',
        value: {
          delegatorAddress,
          validatorAddress,
          amount: {
            amount,
            denom: chainInformation.demon,
          },
        },
      },
    ],
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
