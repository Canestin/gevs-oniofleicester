import { Injectable, NotFoundException } from '@nestjs/common';
import { Candidate } from './entities/candidate.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CandidateService {
  constructor(
    @InjectRepository(Candidate)
    private candidateRepository: Repository<Candidate>,
  ) {}

  async findAll() {
    return `This action returns all candidate`;
  }

  async findOne(id: number) {
    const candidate = await this.candidateRepository.findOneBy({ id });

    if (!candidate) {
      throw new NotFoundException(`Candidate with ID ${id} does not exist`);
    }

    return candidate;
  }
}
