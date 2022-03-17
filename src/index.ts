import { mnemonicToSeedSync } from 'bip39';
import { fromSeed } from 'bip32';
import { BN } from 'bn.js';
import schedule from 'node-schedule';

import {
  convertHexStringToBuffer,
  createTx,
  createTxMessage,
  getAccount,
  getClient,
  getTopValidatorAddress,
  sendTx,
  signTx,
} from './services/cosmos';
import { COIN_TYPE, SUPPORT_CHAIN_LIST } from './config';
import { getReward } from './services/api';
import { Account, ChainInformation, Reward, RewardResponse } from './models/types';
import prompt from './cli/prompt';

const autoStaking = async (privateKey: Buffer, chainInformation: ChainInformation) => {
  const client = await getClient(chainInformation.rpcUrl);
  const account: Account = await getAccount(privateKey, chainInformation);
  const rewardResponse: RewardResponse = await getReward(chainInformation.apiUrl, account.address);

  const validatorAddress = getTopValidatorAddress(rewardResponse.result.rewards);
  const txMessages = createTxMessage(chainInformation, rewardResponse.result.rewards, account.address, validatorAddress);
  const rawTx = await createTx(client, chainInformation, account.address, txMessages);
  const signedTx = await signTx(privateKey, rawTx, chainInformation);
  const result = await sendTx(client, signedTx);
  console.log('result', result);
};

const run = async () => {
  const { chainType, authType, authString, continueFlag } = await prompt();
  const selectedChainInformation: ChainInformation | undefined = SUPPORT_CHAIN_LIST.find((chain) => chain.ticker === chainType);

  if (selectedChainInformation === undefined) {
    return;
  }

  // validation check, should remove authType after privateKey supported
  if (continueFlag) {
    let privateKey: Buffer;

    if (authType === 'mnemonic') {
      const seed = mnemonicToSeedSync(authString);
      const node = fromSeed(seed);

      const child = node.derivePath(`m/44'/${COIN_TYPE}'/0'/0/0`);
      if (child.privateKey !== undefined) {
        privateKey = child.privateKey;
      }
    } else {
      privateKey = convertHexStringToBuffer(authString.startsWith('0x') ? authString.slice(2) : authString);
    }
    schedule.scheduleJob('*/1 * * * *', async () => {
      await autoStaking(privateKey, selectedChainInformation);
    });
  }
};

run();
