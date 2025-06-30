import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '@/common/decorators/public.decorator';
import { LoginDto } from '@/modules/auth/auth.dto';
import { AuthService } from '@/modules/auth/auth.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @Public()
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  //   @Post('register')
  //   register(@Body() dto: RegisterDto) {
  //     return this.authService.register(dto);
  //   }
}
