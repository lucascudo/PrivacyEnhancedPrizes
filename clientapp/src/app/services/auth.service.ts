import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import * as moment from "moment";
import { Observable, shareReplay } from "rxjs";
import { tap } from 'rxjs/operators';
import { environment } from "src/environments/environment";
import { IUser } from "../models/user.model";
import { JwtHelperService } from "@auth0/angular-jwt";
import { KeyExchangeService } from "../services/key-exchange.service";


@Injectable()
export class AuthService {

  constructor(private http: HttpClient, private keyExchangeService: KeyExchangeService) {}

  private setSession(authResult: any): void {
    const jwtHelper = new JwtHelperService();
    const decodedToken = jwtHelper.decodeToken(authResult.access_token);
    const expiresAt = moment().add(decodedToken.exp,'second');

    localStorage.setItem('access_token', authResult.access_token);
    localStorage.setItem('decoded_token', JSON.stringify(decodedToken));
    localStorage.setItem('exp', JSON.stringify(expiresAt.valueOf()) );
  }

  login(username:string, password:string ): Observable<IUser>  {
      return this.http.post<IUser>(environment.api + 'login', {username, password})
        .pipe(tap(this.setSession))
        .pipe(shareReplay());
  }

  register(username:string, password:string ): Observable<any>  {
    const message = JSON.stringify({ username, password });
    //let encryptedMessage = this.keyExchangeService.encryptMessage(message);
    //return this.http.post<IUser>(environment.api + 'register', encryptedMessage);
    return this.keyExchangeService.getKeys();
  }

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('decoded_token');
    localStorage.removeItem('exp');
  }

  isLoggedIn(): boolean {
    return moment().isBefore(this.getExpiration());
  }

  isLoggedOut(): boolean {
    return !this.isLoggedIn();
  }

  getExpiration(): moment.Moment {
    const expiration: any = localStorage.getItem('exp');
    const expiresAt: any = JSON.parse(expiration);
    return moment(expiresAt);
  }

  getProfile(): Observable<IUser> {
    return this.http.get<IUser>(environment.api + 'profile');
  }
}
