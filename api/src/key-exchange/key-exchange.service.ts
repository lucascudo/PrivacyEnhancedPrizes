import { Injectable } from '@nestjs/common';
import { createDiffieHellman, randomBytes } from 'crypto';
import aesjs from 'aes-js';

@Injectable()
export class KeyExchangeService {
  constructor() {
    this.publicKey = this.bob.generateKeys();
  }

  private bob = createDiffieHellman(1024);
  private publicKey: Buffer;

  getSharedKeys() {
    return {
      publicKey: this.publicKey.toString('hex'),
      primeNumber: this.bob.getPrime().toString('hex'),
      generator: this.bob.getGenerator().toString('hex'),
    };
  }

  decryptMessage(key: Buffer, message: string) {
    const sharedKey = this.bob.computeSecret(key);
    return this.crypt(sharedKey, message, 'decrypt');
  }

  encryptMessage(message: string) {
    const sharedKey = this.bob.computeSecret(this.bob.getPrivateKey());
    return this.crypt(sharedKey, message, 'encrypt');
  }

  private getFreshAesCbc(sharedKey: Buffer) {
    return new aesjs.ModeOfOperation.cbc(sharedKey, randomBytes(16));
  }

  private crypt(key: Buffer, message: string, op: string) {
    const sharedKey = this.bob.computeSecret(key);
    return String.fromCharCode.apply(
      null,
      this.getFreshAesCbc(sharedKey)[op](message),
    );
  }
}
