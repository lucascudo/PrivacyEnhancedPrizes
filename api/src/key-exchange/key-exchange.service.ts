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
      nacl.sealedbox_open(
        cipherText,
        this.alice.publicKey,
        this.alice.secretKey,
      ),
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
    bobPublicKey: Uint8Array,
    plainText: string,
  ): Uint8Array {
    const cipherText = nacl.sealedbox(
      nacl.box(
        nacl.decodeUTF8(plainText),
        oneTimeCode,
        bobPublicKey,
        this.alice.secretKey,
      ),
      bobPublicKey,
    );
    return cipherText;
  }

  encryptPlainText(plainText: string, bobPublicKey: Uint8Array) {
    const publicKey = this.getPublicKey();
    const oneTimeCode = this.getOneTimeCode();
    const cipherText = this.encryptMessage(
      oneTimeCode,
      bobPublicKey,
      plainText,
    );
    return {
      oneTimeCode: Array.from(oneTimeCode),
      publicKey: Array.from(publicKey),
      cipherText: Array.from(cipherText),
    };
  }
}
