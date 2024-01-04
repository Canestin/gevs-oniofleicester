import { Body, Controller, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  CreateJwtRequest,
  CreateJwtResponse,
  RefreshJwtRequest,
  RefreshJwtResponse,
} from '../shared/interfaces/auth.interface';
import { AuthService } from './auth.service';
import { JwtRefreshAuthGuard } from './jwt-refresh/jwt-refresh-auth.guard';
import { LocalAuthGuard } from './local/local-auth.guard';

@ApiTags('🔐 Authentication API')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  /** Create User JWT from Login action  */
  @Post('/user/jwt')
  createUserJwt(@Body() payload: CreateJwtRequest): Promise<CreateJwtResponse> {
    return this.authService.createUserJwt(payload.email, payload.password);
  }

  /** Create User JWT from refreshToken  */
  @UseGuards(JwtRefreshAuthGuard)
  @Post('/user/refresh-jwt')
  async refreshUserJwt(
    @Body() payload: RefreshJwtRequest,
    @Req() request: Request,
  ): Promise<RefreshJwtResponse> {
    return this.authService.refreshUserJwt(request);
  }

  /**
   * Logout User endpoint - revoke JWT refreshToken
   * No need to revoke access token because expiry date is short
   */
  @UseGuards(LocalAuthGuard)
  @Post('/user/:userId/logout')
  logoutUser(@Param('userId') id: string): Promise<void> {
    return this.authService.revokeRefreshToken(id);
  }
}
