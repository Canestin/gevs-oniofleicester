import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { StaffAuthService } from '../admin-auth.service';
import { Admin } from '../../gevs/entities/admin.entity';

/**
 * Passport local strategy wrapper
 *
 * @see https://docs.nestjs.com/techniques/authentication#implementing-passport-local
 * @see http://www.passportjs.org/packages/passport-local/
 */
@Injectable()
export class LocalStaffStrategy extends PassportStrategy(
  Strategy,
  'local-staff',
) {
  constructor(private authService: StaffAuthService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  // Passport will attach it as a property "user" on the Request object.
  async validate(email: string, password: string): Promise<Admin> {
    return await this.authService.validateStaff(email, password);
  }
}
