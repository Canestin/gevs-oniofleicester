import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Constituency } from './entities/constituency.entity';
import { Repository } from 'typeorm';
import {
  ResultsByCandidate,
  ResultsByConstituency,
} from '../shared/interfaces/result.interface';

@Injectable()
export class ConstituencyService {
  constructor(
    @InjectRepository(Constituency)
    private constituencyeRepository: Repository<Constituency>,
  ) {}

  async findAll(): Promise<Constituency[]> {
    return await this.constituencyeRepository.find();
  }

  async getResultsByConstituency(sub: string): Promise<ResultsByConstituency> {
    const s = !isNaN(+sub) ? { id: +sub } : { name: sub.toLowerCase() };
    const constituency = await this.constituencyeRepository.findOneBy(s);

    if (!constituency) {
      throw new NotFoundException(`Constituency ${sub} does not exist`);
    }

    let result: ResultsByCandidate[] = [];

    for (const candidate of constituency.candidates) {
      result.push({
        name: candidate.name,
        party: candidate.party.name,
        vote: candidate.vote_count,
      });
    }

    result.sort((a, b) => b.vote - a.vote);

    return {
      constituency: constituency.name.toLowerCase(),
      result: result,
    };
  }
}
