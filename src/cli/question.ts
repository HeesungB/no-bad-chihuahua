import { ConfirmQuestion, InputQuestion, Inquirer, ListQuestion, Question } from 'inquirer';
import { mnemonicValidation, privateKeyValidation } from './validation';

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
  validate: mnemonicValidation,
};

export const privateKeyQuestion: InputQuestion = {
  type: 'input',
  name: 'privateKey',
  message: 'What is your privateKey?',
  validate: privateKeyValidation,
};

export const continueConfirmQuestion: ConfirmQuestion = {
  type: 'confirm',
  name: 'continueFlag',
  message: 'It will start from next schedule. Would you like to go on?',
};
