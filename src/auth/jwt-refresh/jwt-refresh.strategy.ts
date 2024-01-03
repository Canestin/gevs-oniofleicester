import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { jwtConstants } from '../constants';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RevokedRefreshToken } from '../revoked-refresh-token.entity';
import { JsonWebToken } from 'src/shared/interfaces/auth.interface';
import { JwtService } from '@nestjs/jwt';
import { Voter } from '../../voter/entities/voter.entity';
import { Admin } from '../../gevs/entities/admin.entity';

/**
 * @see https://docs.nestjs.com/techniques/authentication#jwt-functionality
 */

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    @InjectRepository(Voter)
    private readonly voterRepository: Repository<Voter>,
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
    @InjectRepository(RevokedRefreshToken)
    private readonly revokedTokenRepository: Repository<RevokedRefreshToken>,
    private jwtService: JwtService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
      secretOrKey: jwtConstants.secret,
    });
  }

  /**
   * Passport verify callback
   *
   * For the jwt-strategy, Passport first verifies the JWT's signature and
   * decodes the JSON. It then invokes our validate() method passing the
   * decoded JSON as its single parameter. Based on the way JWT signing
   * works, we're guaranteed that we're receiving a valid token that we
   * have previously signed and issued to a valid user.
   *
   * Passport will attach it as a property "user" on the Request object.
   */
  async validate(payload: JsonWebToken) {
    const u = await Promise.all([
      this.voterRepository.findOneBy({ id: Number(payload.sub) }),
      this.adminRepository.findOneBy({ id: Number(payload.sub) }),
    ]);

    if (!u[0] && !u[1]) {
      throw new UnauthorizedException(
        `'sub' property ${payload.sub} does not match with any existing user`,
      );
    }

    const user = u[0] || u[1];

    const codedPayload = this.jwtService.sign(payload);

    const isRefreshTokenRevoked = await this.revokedTokenRepository.findOne({
      where: { revokedRefreshToken: codedPayload },
    });

    if (isRefreshTokenRevoked) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    return user;
  }
}
