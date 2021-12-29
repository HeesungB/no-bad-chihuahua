import { mnemonicToSeedSync } from 'bip39';
import { BIP32Interface, fromSeed } from 'bip32';
import schedule from 'node-schedule';
import { createRawTx, getAccount, PATH, sendTx, signTx } from './services/cosmos';
import { getReward } from './services/api';
import { BN } from 'bn.js';
import prompt from './prompt';
import { Account } from './types/types';

const autoStaking = async (account: Account, child: BIP32Interface) => {
  const rewardResponse = await getReward(account.address);
  const validatorAddress = rewardResponse.result.rewards[0].validator_address;
  const amount = new BN(rewardResponse.result.rewards[0].reward[0].amount.split('.')[0], 10);
  const gasPrice = new BN(200000, 10);

  const rawTx = await createRawTx(account.address, validatorAddress, amount.sub(gasPrice).toString());
  const signedTx = await signTx(child, 'chihuahua', rawTx);
  const result = await sendTx(signedTx);
};

const run = async () => {
  const { tokenType, authType, authString, continueFlag } = await prompt();

  // validation check, should remove authType after privateKey supported
  if (continueFlag && authType === 'mnemonic') {
    let child: BIP32Interface;
    let account: Account;
    if (authType === 'mnemonic') {
      const seed = mnemonicToSeedSync(authString);
      const node = fromSeed(seed);

      child = node.derivePath(`m/44'/${PATH}'/0'/0/0`);
      account = getAccount(child, 'chihuahua');
    } else {
      console.log('Private key is not supported yet');
    }

    schedule.scheduleJob('*/1 * * * *', async () => {
      await autoStaking(account, child);
    });
  }
};

run();
