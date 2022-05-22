import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";


@Injectable()
export class KeyExchangeService {

  constructor(private http: HttpClient) {}

  getKeys(): Promise<any> {
    return this.http.get<any>(environment.api + 'keys').toPromise();
  }

  getPublicKeyDiffieHellman(prime: number, base: number, integer: number) {
    //TODO make the big numbers work
    console.log(Math.pow(base, integer) % prime);
		return Math.pow(base, integer) % prime;
	}

	getSharedKeyDiffieHellman(prime: number, integer: number, public_key: number) {
		return Math.pow(public_key, integer) % prime;
	}
}
