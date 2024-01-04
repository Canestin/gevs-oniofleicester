import { Module } from '@nestjs/common';
import { CandidateModule } from '../candidate/candidate.module';
import { PartyModule } from '../party/party.module';
import { VoterModule } from '../voter/voter.module';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as config from '../../ormconfig';
import { SharedModule } from '../shared/shared.module';
import { EncryptionService } from '../shared/services/encryption.service';
import { ConstituencyModule } from '../constituency/constituency.module';
import { GevsModule } from '../gevs/gevs.module';

@Module({
  imports: [
    VoterModule,
    CandidateModule,
    PartyModule,
    SharedModule,
    ConstituencyModule,
    GevsModule,
    TypeOrmModule.forRoot(config),
  ],
  controllers: [AppController],
  providers: [EncryptionService],
})
export class AppModule {}
