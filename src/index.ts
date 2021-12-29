import { mnemonicToSeedSync } from 'bip39';
import { fromSeed } from 'bip32';
import { BN } from 'bn.js';
import schedule from 'node-schedule';

import { convertHexStringToBuffer, createClaimAndDelegateRawTx, getAccount, getClient, sendTx, signTx } from './services/cosmos';
import { COIN_TYPE, GAS_PRICE, SUPPORT_CHAIN_LIST } from './config';
import { getReward } from './services/api';
import { ChainInformation } from './models/types';
import prompt from './cli/prompt';

const autoStaking = async (privateKey: Buffer, chainInformation: ChainInformation) => {
  const client = await getClient(chainInformation.rpcUrl);
  const account = await getAccount(privateKey, chainInformation);
  const rewardResponse = await getReward(account.address);

  const validatorAddress = rewardResponse.result.rewards[0].validator_address;
  const amount = new BN(rewardResponse.result.rewards[0].reward[0].amount.split('.')[0], 10);
  const gasPrice = new BN(GAS_PRICE, 10);

  const rawTx = await createClaimAndDelegateRawTx(
    client,
    account.address,
    validatorAddress,
    amount.sub(gasPrice).toString(),
    chainInformation,
  );
  const signedTx = await signTx(privateKey, rawTx, chainInformation);
  const result = await sendTx(client, signedTx);
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
