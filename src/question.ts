import { ConfirmQuestion, InputQuestion, ListQuestion, Question } from 'inquirer';

export type TokenType = 'HUAHUA';
export type AuthType = 'mnemonic' | 'privateKey';

const tokenTypeList: TokenType[] = ['HUAHUA'];

const authTypeList: AuthType[] = ['mnemonic', 'privateKey'];

export const tokenTypeQuestion: ListQuestion = {
  type: 'list',
  name: 'tokenType',
  message: 'What would you like to steak🥩?',
  choices: tokenTypeList,
};

export const authTypeQuestion: ListQuestion = {
  type: 'list',
  name: 'authType',
  message: 'What is your authentication method?',
  choices: authTypeList,
};

export const mnemonicQuestion: InputQuestion = {
  type: 'input',
  name: 'mnemonic',
  message: 'What is your mnemonic words?',
};

export const privateKeyQuestion: InputQuestion = {
  type: 'input',
  name: 'privateKey',
  message: 'What is your privateKey?',
};

export const continueConfirmQuestion: ConfirmQuestion = {
  type: 'confirm',
  name: 'continueFlag',
  message: 'Would you like to go on?',
};
