import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UseRoles } from 'nest-access-control';
import { Seller } from '../seller/entities/seller.entity';
import { EncryptionService } from '../shared/encryption/encryption.service';
import {
  CreateJwtResponse,
  CreateJwtRequest,
  RefreshJwtRequest,
  RefreshJwtResponse,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  EditPasswordRequest,
  DeleteAccountRequest,
} from '../shared/interfaces/auth.interface';
import { JwtRefreshAuthGuard } from './jwt-refresh/jwt-refresh-auth.guard';
import { LocalAuthGuard } from './local/local-auth.guard';
import { VoterAuthService } from './voter-auth.service';
import { ApiResources } from '../app/app.roles';
import { SellerRole } from '../shared/interfaces/seller.interface';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from './jwt/jwt-auth.guard';
import { RolesGuard } from 'src/shared/guards/roles.guard';

@ApiTags('🔐 Authentication API')
@Controller('auth')
export class AuthController {
  constructor(
    private encryptionService: EncryptionService,
    private sellerAuthService: VoterAuthService,
  ) {}

  // --------- Seller -----------

  /** Create Seller JWT from Login action  */
  @Post('/seller/jwt')
  createSellerJwt(
    @Body() payload: CreateJwtRequest,
  ): Promise<CreateJwtResponse> {
    /** @todo create a custom Pipe for CreateJwtRequest */
    return this.sellerAuthService.createSellerJwt(
      payload.email,
      payload.password,
    );
  }

  /** Create Seller JWT from refreshToken  */
  @UseGuards(JwtRefreshAuthGuard)
  @Post('/seller/refresh-jwt')
  async refreshSellerJwt(
    @Body() payload: RefreshJwtRequest,
    @Req() request: Request,
  ): Promise<RefreshJwtResponse> {
    const seller = request['user'] as Seller;
    const accessToken = this.encryptionService.generateJwt(
      seller,
      '1h',
      SellerRole.SELLER,
    );

    return { accessToken };
  }

  /**
   * Logout Seller endpoint - revoke JWT refreshToken
   * No need to revoke access token because expiry date is short
   */
  @UseGuards(LocalAuthGuard)
  @Post('/seller/:id/logout')
  logoutSeller(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.sellerAuthService.revokeRefreshToken(id);
  }

  /** Seller forgot password endpoint */
  @ApiOperation({
    description: `Request a password reset email for a seller`,
  })
  @HttpCode(HttpStatus.ACCEPTED)
  @Post('/seller/forgot-password')
  forgotSellerPassword(@Body() payload: ForgotPasswordRequest) {
    this.sellerAuthService.sendSellerPasswordResetInstructions(payload.email);
  }

  /** seller reset password endpoint */
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    description: `Reset a password for a seller`,
  })
  @Patch('/seller/reset-password/:token')
  async resetSellerPassword(
    @Param('token') resetToken: string,
    @Body() payload: ResetPasswordRequest,
  ) {
    return this.sellerAuthService.resetSellerPassword(
      resetToken,
      payload.password,
    );
  }

  /** seller edit password (In the App) endpoint */
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    description: `Reset a password for a seller`,
  })
  // @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @UseRoles(
  //   {
  //     resource: ApiResources.SELLER,
  //     action: 'update',
  //     possession: 'any',
  //   },
  //   {
  //     resource: ApiResources.SELLER,
  //     action: 'update',
  //     possession: 'own',
  //   },
  // )
  @Patch('/seller/:sellerId/edit-password')
  async editSellerPassword(
    @Param('sellerId') sellerId: string,
    @Body() payload: EditPasswordRequest,
  ) {
    return this.sellerAuthService.editSellerPassword(
      sellerId,
      payload.currentPassword,
      payload.newPassword,
    );
  }

  @Post('/seller/:sellerId/delete-account')
  async deleteSellerAccount(
    @Param('sellerId') sellerId: string,
    @Body() payload: DeleteAccountRequest,
  ) {
    return this.sellerAuthService.deleteSellerAccount(
      sellerId,
      payload.password,
    );
  }
}
