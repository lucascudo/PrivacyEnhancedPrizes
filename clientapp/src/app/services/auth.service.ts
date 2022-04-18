import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import * as moment from "moment";
import { shareReplay } from "rxjs";
import { tap } from 'rxjs/operators';
import { environment } from "src/environments/environment";
import { IUser } from "../models/user.model";

@Injectable()
export class AuthService {

  constructor(private http: HttpClient) {
  }


  private setSession(authResult: any) {
    console.log(authResult);
    //const expiresAt = moment().add(authResult.expiresIn,'second');

    //localStorage.setItem('id_token', authResult.idToken);
    //localStorage.setItem("expires_at", JSON.stringify(expiresAt.valueOf()) );
  }

  login(username:string, password:string ) {
      return this.http.post<IUser>(environment.api + 'auth/login', {username, password})
        .pipe(tap(this.setSession))
        .pipe(shareReplay());
  }

  logout() {
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
  }

  public isLoggedIn() {
    return moment().isBefore(this.getExpiration());
  }

  isLoggedOut() {
    return !this.isLoggedIn();
  }

  getExpiration() {
    const expiration: any = localStorage.getItem('expires_at');
    const expiresAt: any = JSON.parse(expiration);
    return moment(expiresAt);
  }

  getProfile() {
    return this.http.get<IUser>(environment.api + 'profile');
  }
}
