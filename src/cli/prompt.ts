import inquirer from 'inquirer';
import {
  AuthType,
  authTypeQuestion,
  continueConfirmQuestion,
  mnemonicQuestion,
  privateKeyQuestion,
  TokenType,
  tokenTypeQuestion,
} from './question';

export interface PromptAnswers {
  tokenType: TokenType;
  authType: AuthType;
  authString: string;
  continueFlag: boolean;
}

export default async (): Promise<PromptAnswers> => {
  const { tokenType } = (await inquirer.prompt(tokenTypeQuestion)) as { tokenType: TokenType };
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
    tokenType,
    authType,
    authString,
    continueFlag,
  };
};
