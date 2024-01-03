import { Module } from '@nestjs/common';
import { ConstituencyService } from './constituency.service';
import { ConstituencyController } from './constituency.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Constituency } from './entities/constituency.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Constituency])],
  controllers: [ConstituencyController],
  providers: [ConstituencyService],
  exports: [ConstituencyService],
})
export class ConstituencyModule {}
