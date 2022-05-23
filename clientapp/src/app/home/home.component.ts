import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CardsService } from '../services/cards.service';
import { KeyExchangeService } from '../services/key-exchange.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(
    private router: Router,
    private authService: AuthService,
    private cardsService: CardsService,
    private keyExchangeService: KeyExchangeService,
  ) { }

  username: string = '';
  card: any;

  ngOnInit(): void {
    this.username = this.authService.getdecodedToken().username;
    this.cardsService.scratch().subscribe(res => {
      this.card = JSON.parse(
        this.keyExchangeService.decryptMessage(
          Uint8Array.from(res.oneTimeCode),
          Uint8Array.from(res.cipherText),
        ),
      );
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

}
