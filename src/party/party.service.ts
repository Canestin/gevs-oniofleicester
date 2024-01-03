import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Party } from './entities/party.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PartyService {
  constructor(
    @InjectRepository(Party)
    private partyRepository: Repository<Party>,
  ) {}

  async findAllParties(): Promise<Party[]> {
    return await this.partyRepository.find();
  }

  async findOne(id: number): Promise<Party> {
    return await this.partyRepository.findOneBy({ id });
  }
}
