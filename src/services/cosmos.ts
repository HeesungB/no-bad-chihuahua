import { encodeSecp256k1Pubkey, pubkeyToAddress } from '@cosmjs/amino';
import { DirectSecp256k1Wallet, encodePubkey, makeAuthInfoBytes, makeSignDoc } from '@cosmjs/proto-signing';
import { StargateClient } from '@cosmjs/stargate';
import { BIP32Interface } from 'bip32';
import { Account, RawTx, SignedTx } from '../types/types';
import { TxRaw } from 'cosmjs-types/cosmos/tx/v1beta1/tx';
import { registry } from '../types/defaultRegistryTypes';

export const PATH = 118;
declare type CHAIN = 'osmo' | 'chihuahua';

export const getAccount = (node: BIP32Interface, prefix: CHAIN): Account => {
  const address = pubkeyToAddress(
    {
      type: 'tendermint/PubKeySecp256k1',
      value: node.publicKey.toString('base64'),
    },
    prefix
  );
  return { address, publicKey: node.publicKey.toString('base64') };
};

const getClient = async (): Promise<StargateClient> => {
  const client = await StargateClient.connect('https://rpc.chihuahua.wtf');

  return client;
};

export const createRawTx = async (delegatorAddress: string, validatorAddress: string, amount: string): Promise<RawTx> => {
  const client = await getClient();

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
          denom: 'uhuahua',
          amount: '7000',
        },
      ],
      gas: '200000',
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
            denom: 'uhuahua',
          },
        },
      },
    ],
    sequence: `${sequence.sequence}`,
  };

  return rawTx;
};

export const signTx = async (node: BIP32Interface, prefix: CHAIN, rawTx: RawTx): Promise<SignedTx> => {
  if (node.privateKey !== undefined) {
    const wallet = await DirectSecp256k1Wallet.fromKey(new Uint8Array(node.privateKey), prefix);
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
  }

  return { rawTx };
};

export const sendTx = async (signedTx: SignedTx): Promise<string> => {
  const client = await getClient();

  const txRawCall = signedTx.signedTx.txRaw;
  const txBytes = TxRaw.encode(txRawCall).finish();
  const response = await client.broadcastTx(txBytes);

  return response.transactionHash;
};
