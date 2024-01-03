import { Module } from '@nestjs/common';
import { GevsService } from './gevs.service';
import { GevsController } from './gevs.controller';
import { ConstituencyModule } from '../constituency/constituency.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Status } from './entities/status.entity';
import { PartyModule } from 'src/party/party.module';

@Module({
  imports: [
    ConstituencyModule,
    PartyModule,
    TypeOrmModule.forFeature([Status]),
  ],
  controllers: [GevsController],
  providers: [GevsService],
})
export class GevsModule {}
