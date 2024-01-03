import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PartyService } from './party.service';

@Controller('party')
export class PartyController {
  constructor(private readonly partyService: PartyService) {}

  @Get()
  findAll() {
    return this.partyService.findAllParties();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.partyService.findOne(+id);
  }
}
