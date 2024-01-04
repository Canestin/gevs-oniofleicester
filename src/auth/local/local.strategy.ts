import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';

/**
 * Passport local strategy wrapper
 *
 * @see https://docs.nestjs.com/techniques/authentication#implementing-passport-local
 * @see http://www.passportjs.org/packages/passport-local/
 */
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  // Passport will attach it as a property "user" on the Request object.
  async validate(email: string, password: string): Promise<any> {
    return await this.authService.validateUser(email, password);
  }
}
