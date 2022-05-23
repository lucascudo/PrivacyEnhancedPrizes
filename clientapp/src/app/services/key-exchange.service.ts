import { HttpClient } from "@angular/common/http";
import { Byte } from "@angular/compiler/src/util";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import * as nacl from 'tweetnacl-ts';
import { BoxKeyPair, ByteArray } from "tweetnacl-ts";


@Injectable()
export class KeyExchangeService {

  constructor(private http: HttpClient) {
    this.getAlicePublicKeyFromServer().subscribe(res => this.alicePublicKey = Uint8Array.from(res));
  }

  private bob: BoxKeyPair = nacl.box_keyPair();
  private alicePublicKey: Uint8Array = new Uint8Array();

  getAlicePublicKey(): Uint8Array {
    return this.alicePublicKey;
  }

  getAlicePublicKeyFromServer(): Observable<ByteArray> {
    return this.http.get<ByteArray>(environment.api + 'public-key');
  }

  getPublicKey(): Uint8Array {
    return this.bob.publicKey;
  }

  getOneTimeCode(): Uint8Array {
    return nacl.randomBytes(24);
  }

  decryptMessage(oneTimeCode: Uint8Array, cipherText: Uint8Array): string {
    let plainText = '';
    const decodedMessage = nacl.box_open(
      cipherText ?? new Uint8Array(),
      oneTimeCode,
      this.alicePublicKey,
      this.bob.secretKey,
    );
    if (decodedMessage) {
      plainText = nacl.encodeUTF8(decodedMessage);
    }
    return plainText;
  }

  encryptMessage(
    oneTimeCode: Uint8Array,
    plainText: string,
  ): Uint8Array {
    return nacl.box(
      nacl.decodeUTF8(plainText),
      oneTimeCode,
      this.alicePublicKey,
      this.bob.secretKey,
    );
  }

  encryptPlainText(plainText: string) {
    const publicKey = this.getPublicKey();
    const oneTimeCode = this.getOneTimeCode();
    const cipherText = this.encryptMessage(oneTimeCode, plainText);
    return {
      oneTimeCode: Array.from(oneTimeCode),
      publicKey: Array.from(publicKey),
      cipherText: Array.from(cipherText),
    };
  }
}
