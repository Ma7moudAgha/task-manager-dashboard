/* eslint-disable prettier/prettier */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private jwtService: JwtService) { }

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    console.log('User found:', user);
    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      console.log('Password match:', isMatch);
      if (isMatch) {
        const { password, ...result } = JSON.parse(JSON.stringify(user));
        return result;
      }
    }
    return null;
  }




  async login(user: any) {
    const payload = { sub: user._id || user.id, email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }


  async register(userData: any) {
    const existingUser = await this.usersService.findByEmail(userData.email);
    if (existingUser) {
      throw new UnauthorizedException('Email already in use');
    }

    const hashed = await bcrypt.hash(userData.password, 10);
    const user = await this.usersService.create({ ...userData, password: hashed });
    return this.login(user);
  }


  async updateProfile(userId: string, updateData: Partial<{ name: string; password: string }>) {
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }
    return this.usersService.updateUser(userId, updateData);
  }

}
