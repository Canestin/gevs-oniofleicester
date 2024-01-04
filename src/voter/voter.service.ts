import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Candidate } from '../candidate/entities/candidate.entity';
import { Constituency } from '../constituency/entities/constituency.entity';
import { EncryptionService } from '../shared/services/encryption.service';
import { CreateVoterDto } from './dto/create-voter.dto';
import { ToVoteDto } from './dto/to-vote.dto';
import { UpdateVoterDto } from './dto/update-voter.dto';
import { Voter } from './entities/voter.entity';
import { AuthService } from '../auth/auth.service';
import { UvcCode } from '../voter/entities/uvc_code.entity';

@Injectable()
export class VoterService {
  constructor(
    private authService: AuthService,
    private encryptionService: EncryptionService,
    @InjectRepository(Voter)
    private voterRepository: Repository<Voter>,
    @InjectRepository(Candidate)
    private candidateRepository: Repository<Candidate>,
    @InjectRepository(Constituency)
    private constituencyRepository: Repository<Constituency>,
    @InjectRepository(UvcCode)
    private uvcCodeRepository: Repository<UvcCode>,
  ) {}

  async create(createVoterDto: CreateVoterDto): Promise<Partial<Voter>> {
    const voter = await this.voterRepository.findOneBy({
      email: createVoterDto.email,
    });

    if (voter) {
      throw new UnauthorizedException('Voter already exists');
    }

    // Verify UVC Code
    const uvcCode = await this.uvcCodeRepository.findOneBy({
      UVC: createVoterDto.UVC,
    });

    if (!uvcCode) {
      throw new UnauthorizedException(`This UVC Code does not exist`);
    }

    if (uvcCode.used) {
      throw new UnauthorizedException(`This UVC Code has already been used`);
    }

    const unencryptedPassword = createVoterDto.password;
    createVoterDto.password = await this.encryptionService.encrypt(
      createVoterDto.password,
    );

    const c = await this.constituencyRepository.findOneBy({
      id: createVoterDto.constituency_id,
    });

    if (!c) {
      throw new UnauthorizedException(
        `Constituency with this ID does not exist`,
      );
    }

    createVoterDto.constituency = c;
    const { email } = await this.voterRepository.save(createVoterDto);

    if (!email) {
      throw new InternalServerErrorException('Error when creating voter');
    }

    await this.uvcCodeRepository.update(uvcCode, {
      used: true,
    });

    return await this.authService.createUserJwt(email, unencryptedPassword);
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

  async toVote(toVoteDto: ToVoteDto) {
    const voter = await this.voterRepository.findOneBy({
      id: toVoteDto.voterId,
    });

    if (!voter) {
      throw new NotFoundException('Voter not found');
    }

    if (voter.has_voted) {
      throw new UnauthorizedException('Voter has already voted');
    }

    const candidate = await this.candidateRepository.findOneBy({
      id: toVoteDto.candidateId,
    });

    if (!candidate) {
      throw new UnauthorizedException(
        `Candidate with ID ${toVoteDto.candidateId} does not exist`,
      );
    }

    const candidateUpdated = await this.candidateRepository.update(
      toVoteDto.candidateId,
      {
        vote_count: candidate.vote_count + 1,
      },
    );

    if (candidateUpdated) {
      await this.voterRepository.update(toVoteDto.voterId, {
        has_voted: true,
      });

      return {
        message: 'Vote successful',
        statusCode: 200,
      };
    } else {
      throw new InternalServerErrorException('Erreur when voting');
    }
  }
}
