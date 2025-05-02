import nacl from "tweetnacl";
import naclUtil from "tweetnacl-util";

import {
  TEncryptedDataObject,
  TNonceData,
  ICryptography,
} from "./ICryptography";

class Cryptography implements ICryptography {
  /**
   * @method getRandomBytes Generate Random Bytes
   *
   * @returns {string} It returns a 32 or n bit secret/password {@link string}
   */
  getRandomBytes = (n = 32): string => {
    return naclUtil.encodeBase64(nacl.randomBytes(n));
  };

  /**
   * @method getNonce Generate nonce for asymmetric encryption
   *
   * @returns {TNonceData} It returns nonce data and length {@link TNonceData}
   */
  getNonce = (): TNonceData => {
    const nonce = nacl.randomBytes(nacl.secretbox.nonceLength);
    return {
      nonceLength: nacl.secretbox.nonceLength,
      nonce: naclUtil.encodeBase64(nonce),
    };
  };

  /**
   * @method encrypt symmetric encrypt
   *
   * @param {string} message Message to encrypt of type {@link string}
   * @param {string} secretKey secret of type {@link string}
   *
   * @returns {Promise<TEncryptedDataObject>} Promise of type {@link TEncryptedDataObject}
   */
  async encrypt(
    message: string,
    secretKey: string
  ): Promise<TEncryptedDataObject> {
    const messageUint8 = naclUtil.decodeUTF8(message);
    const nonceData = this.getNonce();
    const nonceUint8Array = naclUtil.decodeBase64(nonceData.nonce);
    const secretKeyUint8Array = naclUtil.decodeBase64(secretKey);
    const encryptedMessage = nacl.secretbox(
      messageUint8,
      nonceUint8Array,
      secretKeyUint8Array
    );
    const fullMessage = new Uint8Array(
      nonceUint8Array.length + encryptedMessage.length
    );
    fullMessage.set(nonceUint8Array);
    fullMessage.set(encryptedMessage, nonceData.nonceLength);
    const base64EncryptedMessage = naclUtil.encodeBase64(fullMessage);
    return { encryptedData: base64EncryptedMessage, nonceData: nonceData };
  }

  /**
   * @method decrypt symmetric decrypt
   *
   * @param {TEncryptedDataObject} encryptedDataObject  Message to encrypt {@link TEncryptedDataObject}
   * @param {string} secretKey  secret of type {@link string}
   *
   * @returns {Promise<string>} Promise of type {@link string}
   * @throws {Error} Throws Error with the error message 'Invalid data to decrypt'
   */
  async decrypt(
    encryptedDataObject: TEncryptedDataObject,
    secretKey: string
  ): Promise<string> {
    const fullMessage = naclUtil.decodeBase64(
      encryptedDataObject.encryptedData
    );
    const nonceUint8Array = naclUtil.decodeBase64(
      encryptedDataObject.nonceData.nonce
    );
    const secretKeyUint8Array = naclUtil.decodeBase64(secretKey);

    const decryptedMessage = nacl.secretbox.open(
      fullMessage.slice(encryptedDataObject.nonceData.nonceLength),
      nonceUint8Array,
      secretKeyUint8Array
    );
    if (!decryptedMessage) {
      throw new Error("Invalid data to decrypt");
    }
    return naclUtil.encodeUTF8(decryptedMessage);
  }
}
export default Cryptography;
