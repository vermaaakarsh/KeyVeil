/* eslint-disable */

export type TNonceData = {
  nonceLength: number;
  nonce: string;
};

export type TEncryptedDataObject = {
  encryptedData: string;
  nonceData: TNonceData;
};

export interface ICryptography {
  encrypt(message: string, secretKey: string): Promise<TEncryptedDataObject>;
  decrypt(
    encryptedDataObject: TEncryptedDataObject,
    secretKey: string
  ): Promise<string>;
}
