import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { VoterAuthService } from '../voter-auth.service';
import { Voter } from '../../voter/entities/voter.entity';

/**
 * Passport local strategy wrapper
 *
 * @see https://docs.nestjs.com/techniques/authentication#implementing-passport-local
 * @see http://www.passportjs.org/packages/passport-local/
 */
@Injectable()
export class LocalVoterStrategy extends PassportStrategy(
  Strategy,
  'local-voter',
) {
  constructor(private sellerAuthService: VoterAuthService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  // Passport will attach it as a property "user" on the Request object.
  async validate(email: string, password: string): Promise<Voter> {
    return await this.sellerAuthService.validateVoter(email, password);
  }
}
