import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, shareReplay } from "rxjs";
import { environment } from "src/environments/environment";
import { IUser } from "../models/user.model";


@Injectable()
export class KeyExchangeService {

  constructor(private http: HttpClient) {}

  getKeys(): Observable<any> {
    return this.http.get(environment.api + 'keys');
  }
}
