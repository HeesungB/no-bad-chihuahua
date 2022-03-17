import { mnemonicToSeedSync } from 'bip39';
import { fromSeed } from 'bip32';
import schedule from 'node-schedule';

import { createTx, createTxMessage, getAccount, getClient, getTopValidatorAddress, sendTx, signTx } from './services/cosmos';
import { chainType, COIN_TYPE, MNEMONIC, PRIVATE_KEY, SUPPORT_CHAIN_LIST } from './config';
import { getReward } from './services/api';
import { Account, ChainInformation, RewardResponse } from './models/types';

const autoStaking = async (privateKey: Buffer, chainInformation: ChainInformation) => {
  const client = await getClient(chainInformation.rpcUrl);
  const account: Account = await getAccount(privateKey, chainInformation);
  const rewardResponse: RewardResponse = await getReward(chainInformation.apiUrl, account.address);

  const validatorAddress = getTopValidatorAddress(rewardResponse.result.rewards);
  const txMessages = createTxMessage(chainInformation, rewardResponse.result.rewards, account.address, validatorAddress);
  const rawTx = await createTx(client, chainInformation, account.address, txMessages);
  const signedTx = await signTx(privateKey, rawTx, chainInformation);
  const result = await sendTx(client, signedTx);

  console.log('tx => ', result);
};

const run = async () => {
  const selectedChainInformation: ChainInformation | undefined = SUPPORT_CHAIN_LIST.find((chain) => chain.ticker === chainType);

  if (selectedChainInformation === undefined) {
    return;
  }

  let privateKey: Buffer;

  // MNEMONIC TYPE
  const seed = mnemonicToSeedSync(MNEMONIC);
  const node = fromSeed(seed);

  const child = node.derivePath(`m/44'/${COIN_TYPE}'/0'/0/0`);
  if (child.privateKey !== undefined) {
    privateKey = child.privateKey;
  }

  // Private Key Type
  // privateKey = convertHexStringToBuffer(PRIVATE_KEY.startsWith('0x') ? PRIVATE_KEY.slice(2) : PRIVATE_KEY);

  schedule.scheduleJob('*/1 * * * *', async () => {
    await autoStaking(privateKey, selectedChainInformation);
  });
};

run();
