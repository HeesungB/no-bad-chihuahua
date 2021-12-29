import { mnemonicToSeedSync } from 'bip39';
import { fromPrivateKey, fromSeed } from 'bip32';
import schedule from 'node-schedule';
import { createRawTx, getAccount, PATH, sendTx, signTx } from './services/cosmos';
import { PRIVATE_KEY } from './config';
import { getReward } from './services/api';
import { BN } from 'bn.js';

const job = schedule.scheduleJob('*/1 * * * *', async () => {
  const account = await getAccount(PRIVATE_KEY, 'chihuahua');

  var privateKeyBuffer = Buffer.from(PRIVATE_KEY, 'hex');

  const rewardResponse = await getReward(account.address);
  const validatorAddress = rewardResponse.result.rewards[0].validator_address;
  const amount = new BN(rewardResponse.result.rewards[0].reward[0].amount.split('.')[0], 10);
  const gasPrice = new BN(200000, 10);

  const rawTx = await createRawTx(account.address, validatorAddress, amount.sub(gasPrice).toString());
  const signedTx = await signTx(privateKeyBuffer, 'chihuahua', rawTx);
  const result = await sendTx(signedTx);
});
