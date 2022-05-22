import {
  Controller,
  Get,
  Request,
  Post,
  UseGuards,
  Redirect,
} from '@nestjs/common';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { AuthService } from './auth/auth.service';
import { UsersService } from './users/users.service';
import { KeyExchangeService } from './key-exchange/key-exchange.service';

@Controller()
export class AppController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
    private keyExchangeService: KeyExchangeService,
  ) {}

  @Get()
  @Redirect('api', 301)
  index() {
    return;
  }

  @Get('keys')
  keys() {
    return this.keyExchangeService.getSharedKeys();
  }

  @Post('register')
  async register(@Request() req) {
    console.log(req.body);
    const decryptedMessage = this.keyExchangeService.decryptMessage(
      req.body.publicKey,
      req.body.message,
    );
    console.log(decryptedMessage);
    const user = JSON.parse(decryptedMessage);
    const createdUser = this.usersService.create(user);
    const res = this.keyExchangeService.encryptMessage(
      req.body.publicKey,
      JSON.stringify(createdUser),
    );
    return res;
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  profile(@Request() req) {
    return req.user;
  }
}
