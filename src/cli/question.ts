import { ConfirmQuestion, ListQuestion, PasswordQuestion } from 'inquirer';
import { AuthType, ChainType } from '../models/types';
import { mnemonicValidation, privateKeyValidation } from './validation';

const chainTypeList: ChainType[] = ['HUAHUA'];

const authTypeList: AuthType[] = ['mnemonic', 'privateKey'];

export const chainTypeQuestion: ListQuestion = {
  type: 'list',
  name: 'chainType',
  message: 'What would you like to steak🥩?',
  choices: chainTypeList,
};

export const authTypeQuestion: ListQuestion = {
  type: 'list',
  name: 'authType',
  message: 'What is your authentication method?',
  choices: authTypeList,
};

export const mnemonicQuestion: PasswordQuestion = {
  type: 'password',
  name: 'mnemonic',
  message: 'What is your mnemonic words?',
  validate: mnemonicValidation,
};

export const privateKeyQuestion: PasswordQuestion = {
  type: 'password',
  name: 'privateKey',
  message: 'What is your privateKey?',
  validate: privateKeyValidation,
};

export const continueConfirmQuestion: ConfirmQuestion = {
  type: 'confirm',
  name: 'continueFlag',
  message: 'It will start from next schedule. Would you like to go on?',
};
