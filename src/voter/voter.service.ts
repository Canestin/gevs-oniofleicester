import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateVoterDto } from './dto/create-voter.dto';
import { UpdateVoterDto } from './dto/update-voter.dto';
import { Voter } from './entities/voter.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { EncryptionService } from '../shared/services/encryption.service';
import { Constituency } from '../constituency/entities/constituency.entity';

@Injectable()
export class VoterService {
  constructor(
    private encryptionService: EncryptionService,
    @InjectRepository(Voter)
    private voterRepository: Repository<Voter>,
    @InjectRepository(Constituency)
    private constituencyRepository: Repository<Constituency>,
  ) {}

  async create(createVoterDto: CreateVoterDto): Promise<Voter> {
    const voter = await this.voterRepository.findOneBy({
      email: createVoterDto.email,
    });
    if (voter) {
      throw new UnauthorizedException('Voter already exists');
    }
    createVoterDto.password = await this.encryptionService.encrypt(
      createVoterDto.password,
    );

    const constituency = await this.constituencyRepository.findOneBy({
      id: createVoterDto.constituency_id,
    });

    if (!constituency) {
      throw new UnauthorizedException(
        `Constituency with this ID does not exist`,
      );
    }

    createVoterDto.constituency = constituency;
    return await this.voterRepository.save(createVoterDto);
  }

  async findAll(): Promise<Voter[]> {
    return await this.voterRepository.find();
  }

  async findOne(id: number): Promise<Voter> {
    const voter = await this.voterRepository.findOneBy({ id });

    if (!voter) {
      throw new NotFoundException(`Voter with ID ${id} does not exist`);
    }

    delete voter.password;
    return voter;
  }

  async update(id: number, updateVoterDto: UpdateVoterDto): Promise<Voter> {
    const voter = await this.voterRepository.findOneBy({ id });
    if (!voter) {
      throw new NotFoundException('Voter not found');
    }

    if (updateVoterDto.password) {
      updateVoterDto.password = await this.encryptionService.encrypt(
        updateVoterDto.password,
      );
    }

    const voterUpdated = await this.voterRepository.save({
      ...voter,
      ...updateVoterDto,
    });

    delete voterUpdated.password;
    return voterUpdated;
  }

  async toVote(updateVoterDto: UpdateVoterDto) {
    const voter = await this.voterRepository.findOneBy({
      id: updateVoterDto.v,
    });

    if (!voter) {
      throw new NotFoundException('Voter not found');
    }

    if (voter.hasVoted) {
      throw new UnauthorizedException('Voter has already voted');
    }

    const constituency = await this.constituencyRepository.findOneBy({
      id: updateVoterDto.constituency_id,
    });

    if (!constituency) {
      throw new UnauthorizedException(
        `Constituency with this ID does not exist`,
      );
    }

    updateVoterDto.constituency = constituency;
    updateVoterDto.hasVoted = true;

    const voterUpdated = await this.voterRepository.save({
      ...voter,
      ...updateVoterDto,
    });

    delete voterUpdated.password;
    return voterUpdated;
  }
}
