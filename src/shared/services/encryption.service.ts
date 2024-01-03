import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Admin } from '../../gevs/entities/admin.entity';
import { Voter } from '../../voter/entities/voter.entity';
import { AppRole, JsonWebToken } from '../interfaces/auth.interface';

export const SALT_ROUNDS = 10;
@Injectable()
export class EncryptionService {
  constructor(private jwtService: JwtService) {}

  async encrypt(data: string): Promise<string> {
    const encryptedData = await bcrypt.hash(data, SALT_ROUNDS);
    return encryptedData;
  }

  async compare(data: string, encryptedData: string): Promise<boolean> {
    const isMatch = await bcrypt.compare(data, encryptedData);
    return isMatch;
  }

  /**
   * Generate a signed JWT
   *
   * @param user
   * @param expiration string describing a time span (https://github.com/zeit/ms). Eg: 60, "2 days", "10h", "7d"
   * @param role
   */
  generateJwt(user: Voter | Admin, expiration: string, role: AppRole) {
    if (user == null || expiration == null || role == null) {
      throw new Error(
        `Invalid arguments : user: ${user}, expiration: ${expiration}, role: ${role}`,
      );
    }

    const payload: Omit<JsonWebToken, 'exp'> = {
      // exp is handled by expiresIn below
      sub: user.id.toString(),
      iat: Math.floor(Date.now() / 1000), // type is NumericDate (seconds) vs Date is in (ms)
      role: role,
    };

    return this.jwtService.sign(payload, {
      expiresIn: expiration,
    });
  }
}
