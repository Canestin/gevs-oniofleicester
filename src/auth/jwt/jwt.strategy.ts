import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { jwtConstants } from '../constants';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { JsonWebToken } from '../../shared/interfaces/auth.interface';
import { Voter } from '../../voter/entities/voter.entity';
import { Admin } from '../../gevs/entities/admin.entity';

/**
 * @see https://docs.nestjs.com/techniques/authentication
 */

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(Voter)
    private readonly voterRepository: Repository<Voter>,
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
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

    return user;
  }
}
