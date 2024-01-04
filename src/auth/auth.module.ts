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
import { SharedModule } from 'src/shared/shared.module';
import { EncryptionService } from 'src/shared/services/encryption.service';
import { VoterService } from 'src/voter/voter.service';
import { VoterModule } from 'src/voter/voter.module';
import { Voter } from 'src/voter/entities/voter.entity';
import { Admin } from 'src/gevs/entities/admin.entity';

@Module({
  imports: [
    SharedModule,
    VoterModule,
    PassportModule.register({ defaultStrategy: 'local' }),
    TypeOrmModule.forFeature([Voter, Admin, RevokedRefreshToken]),
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      /** signOptions: { expiresIn: '1h'} @iferror */
    }),
  ],
  providers: [
    VoterService,
    AuthService,
    EncryptionService,
    LocalStrategy,
    JwtStrategy,
    JwtRefreshStrategy,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
