import inquirer from 'inquirer';
import { AuthType, ChainType, PromptAnswers } from '../models/types';
import { authTypeQuestion, continueConfirmQuestion, mnemonicQuestion, privateKeyQuestion, chainTypeQuestion } from './question';

export default async (): Promise<PromptAnswers> => {
  const { chainType } = (await inquirer.prompt(chainTypeQuestion)) as { chainType: ChainType };
  const { authType } = (await inquirer.prompt(authTypeQuestion)) as { authType: AuthType };
  let authString: string;
  if (authType === 'mnemonic') {
    const { mnemonic } = (await inquirer.prompt(mnemonicQuestion)) as { mnemonic: string };
    authString = mnemonic;
  } else {
    const { privateKey } = (await inquirer.prompt(privateKeyQuestion)) as { privateKey: string };
    authString = privateKey;
  }
  const { continueFlag } = (await inquirer.prompt(continueConfirmQuestion)) as { continueFlag: boolean };
  return {
    chainType,
    authType,
    authString,
    continueFlag,
  };
};
