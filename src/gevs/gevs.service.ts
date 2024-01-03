import { Injectable } from '@nestjs/common';
import {
  Results,
  ResultsByConstituency,
  Seats,
  StatusType,
} from '../shared/interfaces/result.interface';
import { ConstituencyService } from '../constituency/constituency.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Status } from './entities/status.entity';
import { Repository } from 'typeorm';
import { PartyService } from '../party/party.service';
import { Constituency } from '../constituency/entities/constituency.entity';
import { StatusDto } from './dto/status.dto';

@Injectable()
export class GevsService {
  constructor(
    private constituencyService: ConstituencyService,
    @InjectRepository(Status) private statusRepository: Repository<Status>,
    private partyService: PartyService,
  ) {}

  getWinnerByConstituency(results: Constituency): string {
    const result = results.candidates;
    result.sort((a, b) => b.vote_count - a.vote_count);

    if (result[0].vote_count === result[1].vote_count) {
      return null;
    }

    return result[0].party.name;
  }

  async getResults(): Promise<Results> {
    const { status }: { status: StatusType } =
      await this.statusRepository.findOneBy({ id: 1 });
    const constituencies = await this.constituencyService.findAll();

    const parties = await this.partyService.findAllParties();
    let seats: Seats = [];

    for (const party of parties) {
      seats.push({
        party: party.name,
        seat: 0,
      });
    }

    for (const constituency of constituencies) {
      const winner = this.getWinnerByConstituency(constituency);
      if (!winner) continue;
      const index = seats.findIndex((seat) => seat.party === winner);
      seats[index].seat++;
    }

    seats.sort((a, b) => b.seat - a.seat);

    let winner: string;

    if (seats[0].seat === seats[1].seat) {
      winner = 'Hung Parliament';
    } else {
      winner = seats[0].party;
    }

    return {
      status: status,
      winner: status === StatusType.COMPLETED ? winner : StatusType.PENDING,
      seats: seats,
    };
  }

  async getResultsByConstituency(name: string): Promise<ResultsByConstituency> {
    return this.constituencyService.getResultsByConstituency(name);
  }

  async changeStatus(statusDto: StatusDto) {
    await this.statusRepository.update(1, { status: statusDto.status });
    return {
      status: statusDto.status,
    };
  }
}
