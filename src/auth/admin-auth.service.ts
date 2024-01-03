import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { RevokedRefreshToken } from './revoked-refresh-token.entity';
import {
  AppRole,
  CreateJwtResponse,
} from '../shared/interfaces/auth.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Admin } from '../gevs/entities/admin.entity';
import { EncryptionService } from '../shared/services/encryption.service';

@Injectable()
export class AdminAuthService {
  constructor(
    private encryptionService: EncryptionService,
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
    @InjectRepository(RevokedRefreshToken)
    private revokedTokenRepo: Repository<RevokedRefreshToken>,
  ) {}

  /**
   * Returns the Admin associated with the given credentials
   * Throw otherwise.
   *
   * @param email
   * @param password
   */
  async validateAdmin(email: string, pass: string): Promise<Admin> {
    const admin = await this.adminRepository.findOneBy({ email });

    const isGoodCredentials = admin
      ? await this.encryptionService.compare(pass, admin.password)
      : false;

    if (!isGoodCredentials) {
      throw new UnauthorizedException('Incorrect user or password');
    }

    return admin;
  }

  /** Entrypoint for Admin JWT generation */
  async createAdminJwt(
    email: string,
    password: string,
  ): Promise<CreateJwtResponse> {
    const admin = await this.validateAdmin(email, password);

    const accessToken = this.encryptionService.generateJwt(
      admin,
      '1h',
      AppRole.ADMIN,
    );
    const refreshToken = this.encryptionService.generateJwt(
      admin,
      '182d',
      AppRole.ADMIN,
    );

    // save refreshToken
    admin.refreshToken = refreshToken;
    await admin.save();

    return { accessToken, refreshToken };
  }

  /** On Logout, revoke tokens */
  async revokeRefreshToken(id: string) {
    let admin: Admin;

    try {
      admin = await this.adminRepository.findOneBy({ id: Number(id) });
    } catch (e) {
      return;
    }

    // Save refreshToken as revoked
    if (admin.refreshToken) {
      await this.revokedTokenRepo.save({
        revokedRefreshToken: admin.refreshToken,
      });
    }
  }
}
