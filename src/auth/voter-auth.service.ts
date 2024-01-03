import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  AppRole,
  CreateJwtResponse,
  SuccessResponse,
} from '../shared/interfaces/auth.interface';
import { RevokedRefreshToken } from './revoked-refresh-token.entity';
import { EncryptionService } from '../shared/services/encryption.service';
import { Voter } from 'src/voter/entities/voter.entity';
import { VoterService } from 'src/voter/voter.service';

@Injectable()
export class VoterAuthService {
  constructor(
    private encryptionService: EncryptionService,
    @InjectRepository(Voter) private voterRepository: Repository<Voter>,
    @InjectRepository(RevokedRefreshToken)
    private revokedTokenRepo: Repository<RevokedRefreshToken>,
  ) {}

  /**
   * Returns the Voter associated with the given credentials
   * Throw otherwise.
   *
   * @param email
   * @param password
   */
  async validateVoter(email: string, pass: string): Promise<Voter> {
    const voter = await this.voterRepository.findOneBy({ email });

    const isGoodCredentials = voter
      ? await this.encryptionService.compare(pass, voter.password)
      : false;

    if (!isGoodCredentials) {
      throw new UnauthorizedException('Utilisateur ou mot de passe incorrect');
    }

    return voter;
  }

  /** Entrypoint for Voter JWT generation */
  async createVoterJwt(
    email: string,
    password: string,
  ): Promise<CreateJwtResponse> {
    const voter = await this.validateVoter(email, password);

    const accessToken = this.encryptionService.generateJwt(
      voter,
      '1h',
      AppRole.VOTER,
    );
    const refreshToken = this.encryptionService.generateJwt(
      voter,
      '365d',
      AppRole.VOTER,
    );

    // save refreshToken
    voter.refreshToken = refreshToken;
    await voter.save();

    return { accessToken, refreshToken };
  }

  /** On Logout, revoke tokens */
  async revokeRefreshToken(id: string) {
    let voter: Voter;

    try {
      voter = await this.voterRepository.findOneBy({ id: Number(id) });
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
