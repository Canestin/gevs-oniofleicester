import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { VoterService } from './voter.service';
import { CreateVoterDto } from './dto/create-voter.dto';
import { UpdateVoterDto } from './dto/update-voter.dto';
import { ToVoteDto } from './dto/to-vote.dto';

@Controller('voter')
export class VoterController {
  constructor(private readonly voterService: VoterService) {}

  /**
   * Create a new voter
   */
  @Post()
  create(@Body() createVoterDto: CreateVoterDto) {
    console.log('createVoterDto', createVoterDto);
    return this.voterService.create(createVoterDto);
  }

  /**
   * Get all registered voters
   */
  @Get()
  findAll() {
    return this.voterService.findAll();
  }

  /**
   * Describe a voter
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.voterService.findOne(+id);
  }

  /**
   * Patch an existing voter
   */
  @Patch(':id')
  patch(@Param('id') id: string, @Body() updateVoterDto: UpdateVoterDto) {
    return this.voterService.update(+id, updateVoterDto);
  }

  /**
   * Vote a candidate
   */
  @Post('vote')
  toVote(@Param('id') id: string, @Body() toVoteDto: ToVoteDto) {
    return this.voterService.toVote(toVoteDto);
  }
}
