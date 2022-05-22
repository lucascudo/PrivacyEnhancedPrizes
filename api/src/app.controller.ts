import {
  Controller,
  Get,
  Request,
  Post,
  UseGuards,
  Redirect,
  UnauthorizedException,
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

  @Get('public-key')
  publicKey() {
    return Array.from(this.keyExchangeService.getPublicKey());
  }

  @Post('register')
  async register(@Request() req) {
    const decryptedMessage = this.keyExchangeService.decryptMessage(
      Uint8Array.from(req.body.oneTimeCode),
      Uint8Array.from(req.body.publicKey),
      Uint8Array.from(req.body.cipherText),
    );
    const user = JSON.parse(decryptedMessage);
    const createdUser = this.usersService.create(user);
    const oneTimeCode = this.keyExchangeService.getOneTimeCode();
    const publicKey = this.keyExchangeService.getPublicKey();
    const cipherText = this.keyExchangeService.encryptMessage(
      oneTimeCode,
      Uint8Array.from(req.body.publicKey),
      JSON.stringify(createdUser),
    );
    return {
      oneTimeCode: Array.from(oneTimeCode),
      publicKey: Array.from(publicKey),
      cipherText: Array.from(cipherText),
    };
  }

  @Post('login')
  async login(@Request() req) {
    const user = JSON.parse(
      this.keyExchangeService.decryptMessage(
        Uint8Array.from(req.body.oneTimeCode),
        Uint8Array.from(req.body.publicKey),
        Uint8Array.from(req.body.cipherText),
      ),
    );
    const validatedUser = await this.authService.validateUser(
      user.username,
      user.password,
    );
    if (!validatedUser) {
      throw new UnauthorizedException();
    }
    return this.authService.login(validatedUser);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  profile(@Request() req) {
    return req.user;
  }
}
