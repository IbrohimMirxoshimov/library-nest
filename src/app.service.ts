import { Injectable } from '@nestjs/common';
import { ReqUser } from './modules/auth/auth.interface';

@Injectable()
export class AppService {
  getHello(user: ReqUser) {
    return {
      ok: true,
      user,
    };
  }
}
