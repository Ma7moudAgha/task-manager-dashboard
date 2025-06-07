/* eslint-disable prettier/prettier */
import { Controller, Get, Patch, Body, Request, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  // GET /users/me
  @Get('me')
  async getProfile(@Request() req) {
    return this.usersService.findById(req.user.userId);
  }

  // PATCH /users/me
  @Patch('me')
  async updateProfile(@Request() req, @Body() updateData: any) {
    return this.usersService.updateUser(req.user.userId, updateData);
  }
}
