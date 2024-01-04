import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Candidate } from '../candidate/entities/candidate.entity';
import { Constituency } from '../constituency/entities/constituency.entity';
import { SharedModule } from '../shared/shared.module';
import { Voter } from './entities/voter.entity';
import { VoterController } from './voter.controller';
import { VoterService } from './voter.service';
import { AuthModule } from '../auth/auth.module';
import { UvcCode } from './entities/uvc_code.entity';

@Module({
  imports: [
    AuthModule,
    SharedModule,
    TypeOrmModule.forFeature([Voter, Constituency, Candidate, UvcCode]),
  ],
  controllers: [VoterController],
  providers: [VoterService],
  exports: [VoterService],
})
export class VoterModule {}
