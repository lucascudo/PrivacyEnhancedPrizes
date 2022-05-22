import { Injectable } from '@nestjs/common';
import * as nacl from 'tweetnacl-ts';

@Injectable()
export class KeyExchangeService {
  private alice = nacl.box_keyPair();

  getPublicKey(): Uint8Array {
    return this.alice.publicKey;
  }

  getOneTimeCode(): Uint8Array {
    return nacl.randomBytes(24);
  }

  decryptMessage(
    oneTimeCode: Uint8Array,
    publicKey: Uint8Array,
    cipherText: Uint8Array,
  ): string {
    let plainText = '';
    const decodedMessage = nacl.box_open(
      cipherText,
      oneTimeCode,
      publicKey,
      this.alice.secretKey,
    );
    if (decodedMessage) {
      plainText = nacl.encodeUTF8(decodedMessage);
    }
    return plainText;
  }

  encryptMessage(
    oneTimeCode: Uint8Array,
    publicKey: Uint8Array,
    plainText: string,
  ): Uint8Array {
    //Get the cipher text
    const cipherText = nacl.box(
      nacl.decodeUTF8(plainText),
      oneTimeCode,
      publicKey,
      this.alice.secretKey,
    );
    return cipherText;
  }
}
