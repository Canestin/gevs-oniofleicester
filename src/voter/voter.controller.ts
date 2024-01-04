import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
} from '@nestjs/common';
import { VoterService } from './voter.service';
import { CreateVoterDto } from './dto/create-voter.dto';
import { UpdateVoterDto } from './dto/update-voter.dto';
import { ToVoteDto } from './dto/to-vote.dto';
import { UseRoles } from 'nest-access-control';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { RolesGuard } from '../shared/guards/roles.guard';
import { ApiResources } from '../app/app.roles';

@Controller('voter')
export class VoterController {
  constructor(private readonly voterService: VoterService) {}

  /**
   * Create a new voter
   */
  @Post()
  create(@Body() createVoterDto: CreateVoterDto) {
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
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseRoles(
    {
      resource: ApiResources.VOTER,
      action: 'read',
      possession: 'own',
    },
    {
      resource: ApiResources.VOTER,
      action: 'read',
      possession: 'any',
    },
  )
  @Get(':voterId')
  findOne(@Param('voterId') id: string) {
    return this.voterService.findOne(+id);
  }

  /**
   * Patch an existing voter
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseRoles(
    {
      resource: ApiResources.VOTER,
      action: 'update',
      possession: 'own',
    },
    {
      resource: ApiResources.VOTER,
      action: 'update',
      possession: 'any',
    },
  )
  @Patch(':voterId')
  patch(@Param('voterId') id: string, @Body() updateVoterDto: UpdateVoterDto) {
    return this.voterService.update(+id, updateVoterDto);
  }

  /**
   * Vote a candidate
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseRoles({
    resource: ApiResources.VOTE,
    action: 'create',
    possession: 'own',
  })
  @Post('vote')
  toVote(@Body() toVoteDto: ToVoteDto) {
    return this.voterService.toVote(toVoteDto);
  }
}
