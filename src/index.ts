import { mnemonicToSeedSync } from 'bip39';
import { fromSeed } from 'bip32';
import schedule from 'node-schedule';
import { createRawTx, getAccount, PATH, sendTx, signTx } from './services/cosmos';
import { MNEMONIC } from './config';
import { getReward } from './services/api';
import { BN } from 'bn.js';
import prompt from './prompt';

const seed = mnemonicToSeedSync(MNEMONIC);
const node = fromSeed(seed);

const child = node.derivePath(`m/44'/${PATH}'/0'/0/0`);
const account = getAccount(child, 'chihuahua');

// prompt 이후 scheduleJob 실행되도록 변경 필요
prompt();

const job = schedule.scheduleJob('*/1 * * * *', async () => {
  const rewardResponse = await getReward(account.address);
  const validatorAddress = rewardResponse.result.rewards[0].validator_address;
  const amount = new BN(rewardResponse.result.rewards[0].reward[0].amount.split('.')[0], 10);
  const gasPrice = new BN(200000, 10);

  const rawTx = await createRawTx(account.address, validatorAddress, amount.sub(gasPrice).toString());
  const signedTx = await signTx(child, 'chihuahua', rawTx);
  const result = await sendTx(signedTx);
});
