import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  UseGuards,
  forwardRef,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import type { CreateUserDto } from '../users/dto/create-user.dto';
import type { LoginUserDto } from '../users/dto/login-user.dto';
import { CurrentUser } from 'src/users/users.decorator';
import { JwtAuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@CurrentUser() user) {
    return this.authService.getProfile(user);
  }
}
