import { Module } from '@nestjs/common';
import { VoterService } from './voter.service';
import { VoterController } from './voter.controller';
import { SharedModule } from '../shared/shared.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Voter } from './entities/voter.entity';
import { Constituency } from '../constituency/entities/constituency.entity';

@Module({
  imports: [SharedModule, TypeOrmModule.forFeature([Voter, Constituency])],
  controllers: [VoterController],
  providers: [VoterService],
})
export class VoterModule {}
