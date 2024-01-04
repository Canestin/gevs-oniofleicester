import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Voter } from '../voter/entities/voter.entity';
import { Repository } from 'typeorm';
import {
  AppRole,
  CreateJwtResponse,
  RefreshJwtResponse,
} from '../shared/interfaces/auth.interface';
import { EncryptionService } from '../shared/services/encryption.service';
import { RevokedRefreshToken } from './revoked-refresh-token.entity';
import { Admin } from '../gevs/entities/admin.entity';
import { adminEmail, getRole } from '../app/app.roles';

@Injectable()
export class AuthService {
  constructor(
    private encryptionService: EncryptionService,
    @InjectRepository(Voter)
    private voterRepository: Repository<Voter>,
    @InjectRepository(RevokedRefreshToken)
    private revokedTokenRepo: Repository<RevokedRefreshToken>,
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
  ) {}

  /**
   * Returns the User associated with the given credentials
   * Throw otherwise.
   *
   * @param email
   * @param password
   */
  async validateUser(email: string, pass: string): Promise<Voter | Admin> {
    let user: Voter | Admin;
    if (email === adminEmail) {
      user = await this.adminRepository.findOneBy({ email });
    } else {
      user = await this.voterRepository.findOneBy({ email });
    }

    if (!user) {
      throw new NotFoundException(`User with email ${email} does not exist`);
    }

    const isGoodCredentials = user
      ? await this.encryptionService.compare(pass, user.password)
      : false;

    if (!isGoodCredentials) {
      throw new UnauthorizedException('Incorrect user or password');
    }

    return user;
  }

  /** Entrypoint for Voter JWT generation */
  async createUserJwt(
    email: string,
    password: string,
  ): Promise<CreateJwtResponse> {
    const user = await this.validateUser(email, password);
    const userRole = getRole(user.email);

    const accessToken = this.encryptionService.generateJwt(
      user,
      '1h',
      userRole,
    );
    const refreshToken = this.encryptionService.generateJwt(
      user,
      '182d',
      userRole,
    );

    // save refreshToken
    user.refreshToken = refreshToken;
    await user.save();

    return { accessToken, refreshToken };
  }

  async refreshUserJwt(request: Request): Promise<RefreshJwtResponse> {
    const user: Admin | Voter = request['user'];
    const userRole = getRole(user.email);
    const accessToken = this.encryptionService.generateJwt(
      user,
      '1h',
      userRole,
    );

    return { accessToken };
  }

  /** On Logout, revoke tokens @todo with adminEmail */
  async revokeRefreshToken(id: string) {
    let voter: Voter;

    try {
      voter = await this.voterRepository.findOneBy({ id: Number(id) });
      // admin = await this.adminRepository.findOneBy({ id: Number(id) });
    } catch (e) {
      return;
    }

    // Save refreshToken as revoked
    if (voter.refreshToken) {
      await this.revokedTokenRepo.save({
        revokedRefreshToken: voter.refreshToken,
      });
    }
  }
}
