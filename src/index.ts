import { mnemonicToSeedSync } from 'bip39';
import { fromSeed } from 'bip32';
import schedule from 'node-schedule';
import { convertHexStringToBuffer, createClaimAndDelegateRawTx, getAccount, getClient, sendTx, signTx } from './services/cosmos';
import { COIN_TYPE, GAS_PRICE, MNEMONIC, PRIVATE_KEY, SELECTED_CHAIN, SUPPORT_CHAIN_LIST } from './config';
import { getReward } from './services/api';
import { BN } from 'bn.js';
import { ChainInformation } from './types/types';

let privateKey: Buffer;

if (MNEMONIC !== '') {
  const seed = mnemonicToSeedSync(MNEMONIC);
  const node = fromSeed(seed);

  const child = node.derivePath(`m/44'/${COIN_TYPE}'/0'/0/0`);
  if (child.privateKey !== undefined) {
    privateKey = child.privateKey;
  }
}

if (PRIVATE_KEY !== '') {
  privateKey = convertHexStringToBuffer(PRIVATE_KEY);
}

const selectedChainInformation: ChainInformation = SUPPORT_CHAIN_LIST.filter((chain) => chain.name === SELECTED_CHAIN)[0];

const job = schedule.scheduleJob('*/1 * * * *', async () => {
  const client = await getClient(selectedChainInformation.rpcUrl);
  const account = await getAccount(privateKey, selectedChainInformation);
  const rewardResponse = await getReward(account.address);

  const validatorAddress = rewardResponse.result.rewards[0].validator_address;
  const amount = new BN(rewardResponse.result.rewards[0].reward[0].amount.split('.')[0], 10);
  const gasPrice = new BN(GAS_PRICE, 10);

  const rawTx = await createClaimAndDelegateRawTx(
    client,
    account.address,
    validatorAddress,
    amount.sub(gasPrice).toString(),
    selectedChainInformation
  );
  const signedTx = await signTx(privateKey, rawTx, selectedChainInformation);
  const result = await sendTx(client, signedTx);
});
