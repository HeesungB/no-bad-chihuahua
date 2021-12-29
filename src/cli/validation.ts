import { validateMnemonic } from 'bip39';

export const mnemonicValidation = async (input: string) => {
  if (validateMnemonic(input)) {
    return 'Invalid mnemonic';
  }
  return true;
};

export const privateKeyValidation = async (input: string) => {
  if (!input.match(/^(?:0x)?(\d|[a-z]){64}$/)) {
    return 'Invalid private key';
  }
  return true;
};
