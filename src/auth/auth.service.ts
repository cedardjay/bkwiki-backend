import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

 async register(dto: RegisterDto) {
  const existing = await this.usersService.findByEmail(dto.email);
  if (existing) throw new ConflictException('Email already in use');

  const hashedPassword = await bcrypt.hash(dto.password, 12);
  const user = await this.usersService.create({
    firstName: dto.firstName,
    lastName: dto.lastName,
    email: dto.email,
    password: hashedPassword,
  });

  const token = this.jwtService.sign({ sub: user.id, email: user.email });
  return {
    statusCode: 201,
    message: 'User registered successfully',
    data: { access_token: token },
  };
}

  async login(dto: LoginDto) {
  const user = await this.usersService.findByEmail(dto.email);
  if (!user) throw new UnauthorizedException('Invalid credentials');

  const passwordMatch = await bcrypt.compare(dto.password, user.password);
  if (!passwordMatch) throw new UnauthorizedException('Invalid credentials');

  const token = this.jwtService.sign({ sub: user.id, email: user.email });
  return {
    statusCode: 201,
    message: 'Login successful',
    data: { access_token: token },
  };
}

}