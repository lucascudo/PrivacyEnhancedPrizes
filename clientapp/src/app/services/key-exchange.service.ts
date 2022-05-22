import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import * as nacl from 'tweetnacl-ts';
import { IKeyPair } from "../models/key-pair.model";


@Injectable()
export class KeyExchangeService {

  constructor(private http: HttpClient) {
    this.getAlicePublicKeyFromServer().subscribe(res => this.alicePublicKey = Uint8Array.from(res));
  }

  private bob: IKeyPair = nacl.box_keyPair();
  private alicePublicKey: Uint8Array = new Uint8Array();

  getAlicePublicKey(): Uint8Array {
    return this.alicePublicKey;
  }

  getAlicePublicKeyFromServer(): Observable<Array<number>> {
    return this.http.get<Array<number>>(environment.api + 'public-key');
  }

  getPublicKey(): Uint8Array {
    return this.bob.publicKey;
  }

  getOneTimeCode(): Uint8Array {
    return nacl.randomBytes(24);
  }

  decryptMessage(
    oneTimeCode: Uint8Array,
    cipherText: Uint8Array,
  ): string {
    let plainText = '';
    const decodedMessage = nacl.box_open(
      cipherText,
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
    //Get the cipher text
    const cipherText = nacl.box(
      nacl.decodeUTF8(plainText),
      oneTimeCode,
      this.alicePublicKey,
      this.bob.secretKey,
    );
    return cipherText;
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
