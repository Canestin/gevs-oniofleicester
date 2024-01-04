import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { jwtConstants } from './constants';
import { JwtRefreshStrategy } from './jwt-refresh/jwt-refresh.strategy';
import { JwtStrategy } from './jwt/jwt.strategy';
import { LocalStrategy } from './local/local.strategy';
import { RevokedRefreshToken } from './revoked-refresh-token.entity';
import { AuthService } from './auth.service';
import { SharedModule } from '../shared/shared.module';
import { EncryptionService } from '../shared/services/encryption.service';
import { VoterService } from '../voter/voter.service';
import { VoterModule } from '../voter/voter.module';
import { Voter } from '../voter/entities/voter.entity';
import { Admin } from '../gevs/entities/admin.entity';

@Module({
  imports: [
    SharedModule,
    PassportModule.register({ defaultStrategy: 'local' }),
    TypeOrmModule.forFeature([Voter, Admin, RevokedRefreshToken]),
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, JwtRefreshStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
