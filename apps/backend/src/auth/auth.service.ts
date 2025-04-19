import {
  Inject,
  Injectable,
  UnauthorizedException,
  forwardRef,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import type { CreateUserDto } from '../users/dto/create-user.dto';
import type { LoginUserDto } from '../users/dto/login-user.dto';
import { User } from 'src/users/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    try {
      const user = await this.usersService.findByEmail(email);
      const isPasswordValid = await bcrypt.compareSync(password, user.password);

      if (isPasswordValid) {
        return user;
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;
    const user = await this.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { email: user.email, sub: user._id };
    const token = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET,
    });
    return {
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
      accessToken: token,
    };
  }

  async register(createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);

    const payload = { email: user.email, sub: user._id };

    return {
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
      accessToken: this.jwtService.sign(payload),
    };
  }

  async getProfile(user: User) {
    const profile = await this.usersService.findByEmail(user?.email);
    return profile;
  }
}
