import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CandidateService } from './candidate.service';

@Controller('candidates')
export class CandidateController {
  constructor(private readonly candidateService: CandidateService) {}

  @Get()
  findAll() {
    return this.candidateService.findAll();
  }

  @Get(':candidateId')
  findOne(@Param('candidateId') id: string) {
    return this.candidateService.findOne(+id);
  }
}
